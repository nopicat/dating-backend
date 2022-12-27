import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import {
    CardsDislikeGatewayRouteInput,
    CardsGetListGatewayRouteInput,
    CardsLikeGatewayRouteInput,
} from './cards.gateway.input';
import { Prisma, User } from '@prisma/client';
import { CardResponseDto } from './cards.dto';
import { CardsService } from './cards.service';
import { getDistance } from 'geolib';
import { DateTime } from 'luxon';

@Injectable()
export class CardsGatewayService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cardsService: CardsService,
    ) {}

    public async likeRoute({ user, userId }: CardsLikeGatewayRouteInput) {
        const existLike = await this.prisma.like.findFirst({
            where: {
                OR: [
                    {
                        userId: user.id,
                        userToLikeId: userId,
                    },
                    {
                        userId: userId,
                        userToLikeId: user.id,
                    },
                ],
            },
        });

        if (existLike) {
            if (existLike.userToLikeId === user.id) {
                await this.prisma.like.delete({
                    where: {
                        id: existLike.id,
                    },
                });

                await this.prisma.match.create({
                    data: {
                        userIds: [user.id, userId],
                    },
                });

                // отправить пуши друг другу в очереди

                return;
            }

            if (existLike.userId === user.id) {
                return;

                // ошибка, потому что пользователь уже отправлял лайк этому человеку
            }
        }

        const existDislike = await this.prisma.dislike.findUnique({
            where: {
                userId_userToDislikeId: {
                    userId: user.id,
                    userToDislikeId: userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (existDislike) {
            await this.prisma.dislike.delete({
                where: {
                    userId_userToDislikeId: {
                        userId: user.id,
                        userToDislikeId: userId,
                    },
                },
            });
        }

        await this.prisma.like.create({
            data: {
                userId: user.id,
                userToLikeId: userId,
            },
        });

        // отправить пуш пользователю

        return;
    }

    public async dislikeRoute({ user, userId }: CardsDislikeGatewayRouteInput) {
        const existDislike = await this.prisma.dislike.findUnique({
            where: {
                userId_userToDislikeId: {
                    userId: user.id,
                    userToDislikeId: userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (existDislike) {
            return;

            // ошибка, потому что пользователь уже отправлял дизлайк этому человеку
        }

        const existLike = await this.prisma.like.findUnique({
            where: {
                userId_userToLikeId: {
                    userId: user.id,
                    userToLikeId: userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (existLike) {
            await this.prisma.like.delete({
                where: {
                    userId_userToLikeId: {
                        userId: user.id,
                        userToLikeId: userId,
                    },
                },
            });
        }

        await this.prisma.dislike.create({
            data: {
                userId: user.id,
                userToDislikeId: userId,
            },
        });

        return;
    }

    // todo
    public async superLikeRoute() {}

    public async getListRoute({ user }: CardsGetListGatewayRouteInput) {
        const usersAge = Math.floor(
            Math.abs(DateTime.fromJSDate(user.birthday).diffNow('years').years),
        );

        const userSearchPreferences = await this.prisma.userSearchPreferences.findUnique({
            where: {
                userId: user.id,
            },
        });

        const excludedByLikes = await this.prisma.like
            .findMany({
                where: {
                    userId: user.id,
                },
                select: {
                    userToLikeId: true,
                },
            })
            .then((data) => data.map((id) => id.userToLikeId));

        const excludedByDislikes = await this.prisma.dislike
            .findMany({
                where: {
                    OR: [
                        {
                            userId: user.id,
                        },
                        {
                            userToDislikeId: user.id,
                        },
                    ],
                },
                select: {
                    userId: true,
                    userToDislikeId: true,
                },
            })
            .then((data) =>
                data.map((ids) => (ids.userId === user.id ? ids.userToDislikeId : ids.userId)),
            );

        const excludedByMatches = await this.prisma.match
            .findMany({
                where: {
                    userIds: {
                        hasSome: user.id,
                    },
                },
                select: {
                    userIds: true,
                },
            })
            .then((data) => data.map((id) => id.userIds.filter((_id) => _id !== user.id)[0]));

        const excludedIds = [
            user.id,
            ...excludedByLikes,
            ...excludedByDislikes,
            ...excludedByMatches,
        ].filter((v, i, a) => a.indexOf(v) === i);

        // distance in meters
        // TODO переписать этот кошмар
        const data = await this.prisma.$queryRaw<
            (User & {
                distance: number;
                age: number;
                profilePhotoPath: string;
                profilePhotoBlurHash: string;
            })[]
        >`
            SELECT "User".*, 
                ST_Distance(
                    'POINT(${Prisma.raw(`${user.longitude} ${user.latitude}`)})'::geography,
                    CONCAT('POINT(', "User"."longitude", ' ', "User"."latitude", ')')::geography
                ) AS distance,
                "ProfilePhoto"."path" as "profilePhotoPath",
                "ProfilePhoto"."blurHash" as "profilePhotoBlurHash"
            FROM "User"
            INNER JOIN "ProfilePhoto" AS "ProfilePhoto" ON "ProfilePhoto"."userId" = "User"."id" AND "ProfilePhoto"."isMain" = TRUE
            WHERE (
                "User"."id" NOT IN (${Prisma.join(excludedIds)}) AND
                ST_DWithIn(
                    'POINT(${Prisma.raw(`${user.longitude} ${user.latitude}`)})'::geography,
                    CONCAT('POINT(', "User"."longitude", ' ', "User"."latitude", ')')::geography, 
                    ${userSearchPreferences.maxDistance * 1000}
                ) AND
                ${
                    userSearchPreferences.isAgePrefEnabled
                        ? Prisma.sql`
                            date_part('year', AGE("User"."birthday"))::int BETWEEN ${userSearchPreferences.minAge} AND ${userSearchPreferences.maxAge}
                        `
                        : Prisma.raw(``)
                }
                ${
                    userSearchPreferences.isMaritalStatusPrefEnabled
                        ? Prisma.sql`
                        "User"."maritalStatus" IN ${Prisma.join(
                            userSearchPreferences.maritalStatus,
                        )} AND
                    `
                        : Prisma.raw(``)
                }
                ("User"."id") IN (
                    SELECT "_user"."id"
                    FROM "User" AS "_user"
                    INNER JOIN "UserSearchPreferences" AS "userSearchPreferences"
                        ON ("userSearchPreferences"."userId") = ("_user"."id") 
                    WHERE (
                        (
                            "userSearchPreferences"."isAgePrefEnabled" = FALSE OR 
                            ("userSearchPreferences"."minAge" >= ${usersAge} AND "userSearchPreferences"."maxAge" <= ${usersAge})
                        ) AND (
                            "userSearchPreferences"."isMaritalStatusPrefEnabled" = FALSE OR
                            "userSearchPreferences"."maritalStatus" @> '{${Prisma.raw(
                                user.maritalStatus,
                            )}}'
                        ) AND
                        ST_DWithIn(
                            'POINT(${Prisma.raw(`${user.longitude} ${user.latitude}`)})'::geography,
                            CONCAT('POINT(', "_user"."longitude", ' ', "_user"."latitude", ')')::geography,
                            "userSearchPreferences"."maxDistance" * 1000
                        )
                    )
                )
            )
            ORDER BY distance ASC
            
            LIMIT 10
        `;

        return data.map(
            (object) =>
                new CardResponseDto({
                    id: object.id,
                    firstName: object.firstName,
                    lastName: object.lastName,
                    birthday: object.birthday,
                    about: object.about,
                    city: object.city,
                    photo: object.profilePhotoPath,
                    blurHashPhoto: object.profilePhotoBlurHash,
                    countryCode: object.countryCode,
                    distance: object.distance,
                }),
        );
    }
}
