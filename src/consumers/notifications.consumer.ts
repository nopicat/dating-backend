import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

// TODO
@Processor('push')
export class NotificationsConsumer {
    @Process('fcm')
    public fcm(job: Job<unknown>) {}

    @Process('email')
    public email(job: Job<unknown>) {}
}
