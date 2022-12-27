import { UserRequiredGatewayRouteInput } from '../../common/types/gateway-route-input.interface';

export interface CardsLikeGatewayRouteInput extends UserRequiredGatewayRouteInput {
    userId: number;
}

export interface CardsDislikeGatewayRouteInput extends UserRequiredGatewayRouteInput {
    userId: number;
}

export interface CardsGetListGatewayRouteInput extends UserRequiredGatewayRouteInput {}
