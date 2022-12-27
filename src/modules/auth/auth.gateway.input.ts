import {
    BaseGatewayRouteInput,
    UserRequiredGatewayRouteInput,
} from '../../common/types/gateway-route-input.interface';
import { VKProfile } from '../../common/types/vk-profile.interface';

export interface AuthLoginGatewayRouteInput extends UserRequiredGatewayRouteInput {}

export interface AuthVkCallbackGatewayRouteInput extends BaseGatewayRouteInput {
    vkProfile: VKProfile;
}
