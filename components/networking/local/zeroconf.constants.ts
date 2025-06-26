import Zeroconf from "react-native-zeroconf";

export const zeroconf = new Zeroconf();

export const SERVICE_TYPE = "belote-game";
export const SERVICE_NAME = "belote-game:room";
export const SERVICE_PROTOCOL = "tcp";
export const SERVICE_DOMAIN = "local.";
export const SERVICE_PORT = 12345;
