import { useLocation } from "react-router-dom";
import {
  BACKPACK_FEATURE_XNFT,
  MESSAGES_ENABLED,
  TAB_APPS,
  TAB_BALANCES,
  TAB_MESSAGES,
  TAB_NFTS,
  TAB_NOTIFICATIONS,
  TAB_RECENT_ACTIVITY,
  UI_RPC_METHOD_NAVIGATION_ACTIVE_TAB_UPDATE,
  UI_RPC_METHOD_NAVIGATION_TO_ROOT,
} from "@coral-xyz/common";
import { useUnreadGlobal } from "@coral-xyz/db";
import {
  BalancesIcon,
  GridIcon,
  ImageIcon,
  MessageBubbleIcon,
  MessageBubbleUnreadIcon,
} from "@coral-xyz/react-common";
import {
  useBackgroundClient,
  useFeatureGates,
  useTab,
  useUser,
} from "@coral-xyz/recoil";
import { styles, useCustomTheme } from "@coral-xyz/themes";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Tab, Tabs } from "@mui/material";

import { AvatarPopoverButton } from "../../Unlocked/Settings/AvatarPopover";

import { useBreakpoints } from "./hooks";

const TAB_HEIGHT = 64;

const useStyles = styles((theme) => ({
  tabXs: {
    opacity: "1 !important",
    height: `${TAB_HEIGHT}px`,
    "&:hover": {
      "& svg": {
        "& path": {
          fill: `${theme.custom.colors.brandColor} !important`,
        },
      },
    },
  },
  tab: {
    opacity: "1 !important",
    minWidth: "74px",
    width: "74px",
    marginTop: "16px",
    "&:hover": {
      "& svg": {
        "& path": {
          fill: `${theme.custom.colors.brandColor} !important`,
        },
      },
    },
    "& .MuiTabs-flexContainer": {
      height: "100%",
      width: "100%",
    },
  },
  tabRoot: {
    height: "100%",
    minWidth: "74px",
    width: "74px",
    backgroundColor: theme.custom.colors.nav,
    borderRight: `${theme.custom.colors.borderFull}`,
    "& .MuiTabs-flexContainer": {
      height: "100%",
      width: "100%",
    },
  },
  tabRootXs: {
    height: `${TAB_HEIGHT}px`,
    minHeight: `${TAB_HEIGHT}px`,
    backgroundColor: theme.custom.colors.nav,
    borderTop: `${theme.custom.colors.borderFull}`,
    boxShadow: theme.custom.colors.tabBarBoxShadow,
  },
  tabIndicator: {
    color: "none",
  },
  tabSelected: {
    color: theme.custom.colors.brandColor,
  },
  tabUnselected: {},
  tabButton: {
    padding: 0,
  },
  activeTab: {},
}));

export function WithTabs(props: any) {
  const location = useLocation();
  const { isXs } = useBreakpoints();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isXs ? "column" : "row-reverse",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {props.children}
      </div>
      {!location.pathname.startsWith("/xnft/") &&
        location.pathname !== "/nfts/experience" &&
        location.pathname !== "/nfts/chat" &&
        (!isXs || location.pathname !== "/messages/chat") &&
        (!isXs || location.pathname !== "/messages/groupchat") &&
        (!isXs || location.pathname !== "/messages/profile") && <TabBar />}
    </div>
  );
}

function TabBar() {
  const classes = useStyles();
  const theme = useCustomTheme();
  const { uuid } = useUser();
  const tab = useTab();
  const background = useBackgroundClient();
  const featureGates = useFeatureGates();
  const messagesUnread = useUnreadGlobal(uuid);
  const { isXs } = useBreakpoints();

  const onTabClick = (tabValue: string) => {
    if (tabValue === tab) {
      background.request({
        method: UI_RPC_METHOD_NAVIGATION_TO_ROOT,
        params: [],
      });
    } else {
      background.request({
        method: UI_RPC_METHOD_NAVIGATION_ACTIVE_TAB_UPDATE,
        params: [tabValue],
      });
    }
  };

  return tab === "" ? null : (
    <Tabs
      orientation={isXs ? "horizontal" : "vertical"}
      value={tab}
      variant="fullWidth"
      classes={{
        root: isXs ? classes.tabRootXs : classes.tabRoot,
        indicator: classes.tabIndicator,
      }}
      TabIndicatorProps={{
        style: {
          display: "none",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isXs ? "row" : "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isXs ? "row" : "column",
            width: isXs ? "100%" : undefined,
            justifyContent: isXs ? "space-between" : undefined,
            marginTop: !isXs ? "12px" : undefined,
          }}
        >
          <Tab
            onClick={() => onTabClick(TAB_BALANCES)}
            value={TAB_BALANCES}
            disableRipple
            className={`${isXs ? classes.tabXs : classes.tab} ${
              tab === TAB_BALANCES ? classes.activeTab : ""
            }`}
            icon={
              <BalancesIcon
                fill={
                  tab === TAB_BALANCES
                    ? theme.custom.colors.brandColor
                    : theme.custom.colors.icon
                }
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            }
          />
          {BACKPACK_FEATURE_XNFT && (
            <Tab
              onClick={() => onTabClick(TAB_APPS)}
              value={TAB_APPS}
              disableRipple
              className={isXs ? classes.tabXs : classes.tab}
              icon={
                <GridIcon
                  fill={
                    tab === TAB_APPS
                      ? theme.custom.colors.brandColor
                      : theme.custom.colors.icon
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              }
            />
          )}
          <Tab
            onClick={() => onTabClick(TAB_NFTS)}
            value={TAB_NFTS}
            disableRipple
            className={`${isXs ? classes.tabXs : classes.tab} ${
              tab === TAB_NFTS ? classes.activeTab : ""
            }`}
            icon={
              <ImageIcon
                fill={
                  tab === TAB_NFTS
                    ? theme.custom.colors.brandColor
                    : theme.custom.colors.icon
                }
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            }
          />
          {featureGates[MESSAGES_ENABLED] && (
            <Tab
              onClick={() => onTabClick(TAB_MESSAGES)}
              value={TAB_MESSAGES}
              disableRipple
              className={`${isXs ? classes.tabXs : classes.tab} ${
                tab === TAB_MESSAGES ? classes.activeTab : ""
              }`}
              icon={
                !messagesUnread ? (
                  <MessageBubbleIcon
                    fill={
                      tab === TAB_MESSAGES
                        ? theme.custom.colors.brandColor
                        : theme.custom.colors.icon
                    }
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                ) : (
                  <MessageBubbleUnreadIcon
                    fill={
                      tab === TAB_MESSAGES
                        ? theme.custom.colors.brandColor
                        : theme.custom.colors.icon
                    }
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                )
              }
            />
          )}
          {!isXs && (
            <>
              <Tab
                onClick={() => onTabClick(TAB_NOTIFICATIONS)}
                value={TAB_NOTIFICATIONS}
                disableRipple
                className={`${isXs ? classes.tabXs : classes.tab} ${
                  tab === TAB_MESSAGES ? classes.activeTab : ""
                }`}
                icon={
                  <NotificationsIcon
                    style={{
                      width: "28px",
                      height: "28px",
                      color:
                        tab === TAB_NOTIFICATIONS
                          ? theme.custom.colors.brandColor
                          : theme.custom.colors.icon,
                    }}
                  />
                }
              />
              <Tab
                onClick={() => onTabClick(TAB_RECENT_ACTIVITY)}
                value={TAB_RECENT_ACTIVITY}
                disableRipple
                className={`${isXs ? classes.tabXs : classes.tab} ${
                  tab === TAB_MESSAGES ? classes.activeTab : ""
                }`}
                icon={
                  <FormatListBulletedIcon
                    style={{
                      width: "28px",
                      height: "28px",
                      color:
                        tab === TAB_RECENT_ACTIVITY
                          ? theme.custom.colors.brandColor
                          : theme.custom.colors.icon,
                    }}
                  />
                }
              />
            </>
          )}
        </div>
        {!isXs && (
          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <AvatarPopoverButton
              imgStyle={{
                width: "40px",
                height: "40px",
                borderRadius: "20px",
              }}
              buttonStyle={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </div>
        )}
      </div>
    </Tabs>
  );
}
