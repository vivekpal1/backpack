import type { Token } from "./components/index";

import { Pressable, Text, View } from "react-native";

import { Margin } from "@components";
import { Blockchain, STRIPE_ENABLED } from "@coral-xyz/common";
import {
  // SwapProvider, // TODO(peter): broken
  enabledBlockchains as enabledBlockchainsAtom,
} from "@coral-xyz/recoil";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@hooks";
import { useRecoilValueLoadable } from "recoil";

const HorizontalSpacer = () => <View style={{ width: 16 }} />;
const ENABLE_ONRAMP = false;

type Route = "Receive" | "Send" | "Swap";

function SwapProvider({ children, blockchain, tokenAddress }) {
  return children;
}

export function TransferWidget({
  blockchain,
  address,
  onPressOption,
  token,
}: {
  blockchain?: Blockchain;
  address?: string;
  onPressOption: (option: string, options: any) => void;
  token?: Token;
}) {
  const eb = useRecoilValueLoadable(enabledBlockchainsAtom);
  const enabledBlockchains = eb.state === "hasValue" ? eb.contents : [];
  const enableOnramp = ENABLE_ONRAMP;
  const renderSwap =
    blockchain !== Blockchain.ETHEREUM &&
    enabledBlockchains.includes(Blockchain.SOLANA);

  const onPress = (route: Route, options: any) => onPressOption(route, options);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {enableOnramp ? (
        <>
          <RampButton blockchain={blockchain} address={address} />
          <HorizontalSpacer />
        </>
      ) : null}
      <ReceiveButton onPress={onPress} blockchain={blockchain} />
      <HorizontalSpacer />
      <SendButton onPress={onPress} blockchain={blockchain} token={token} />
      {renderSwap && (
        <>
          <HorizontalSpacer />
          <SwapButton
            onPress={onPress}
            blockchain={blockchain}
            address={address}
          />
        </>
      )}
    </View>
  );
}

function TransferButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <Margin bottom={8}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderColor: theme.custom.colors.borderFull,
            backgroundColor: theme.custom.colors.nav,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons
            name={icon}
            size={24}
            color={theme.custom.colors.fontColor}
          />
        </View>
      </Margin>
      <Text
        style={{
          color: theme.custom.colors.secondary,
          fontSize: 14,
          fontWeight: "500",
          lineHeight: 20,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SwapButton({
  blockchain,
  address,
  onPress,
}: {
  blockchain?: Blockchain;
  address?: string;
  onPress: (route: Route, options: any) => void;
}) {
  return (
    <SwapProvider blockchain={Blockchain.SOLANA} tokenAddress={address}>
      <TransferButton
        label="Swap"
        icon="compare-arrows"
        onPress={() => onPress("Swap", { blockchain })}
      />
    </SwapProvider>
  );
}

function SendButton({
  blockchain,
  onPress,
  token,
}: {
  blockchain?: Blockchain;
  onPress: (route: Route, options: any) => void;
  token?: Token;
}) {
  return (
    <TransferButton
      label="Send"
      icon="arrow-upward"
      onPress={() => onPress("Send", { blockchain, token, title: "TODO" })}
    />
  );
}

function ReceiveButton({
  blockchain,
  onPress,
}: {
  blockchain?: Blockchain;
  onPress: (route: Route, options: any) => void;
}) {
  return (
    <TransferButton
      label="Receive"
      icon="arrow-downward"
      onPress={() => onPress("Receive", { blockchain })}
    />
  );
}

function RampButton({
  blockchain,
  address,
}: {
  blockchain?: Blockchain;
  address?: string;
}) {
  return null;
}
