import { capitalCase } from "change-case";
import { App, f7, View } from "framework7-react";
import React, { useEffect } from "react";
import {
  getAllConvos,
  getAuthToken,
  getConvo,
  loginAsGuest,
  makeJournalPost,
  reauthenticate,
} from "./api";
import { NotLoggedInError, OfflineError } from "./api/errors";
import SidePanel from "./components/Topbar/SidePanel";
import { Message } from "./pages/PaperCupsPage/Chat/types";
import useInterval from "./pages/PaperCupsPage/Speak/useInterval";
import NotificationService from "./services/NotificationService";
import ToastService from "./services/ToastService";
import LocalDatabase, { OnboardingTypes } from "./utils/LocalDatabase";

const f7params = {
  name: "Halcyon",
  id: "com.halcyon.dev",
  routes: [
    {
      path: "/onboarding",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/OnboardingPage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
    },
    {
      path: "/login",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/LoginPage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
    },
    {
      path: "/about",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/AboutPage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
    },
    {
      path: "/",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/HomePage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
    },
    {
      path: "/profile",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/ProfilePage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
      routes: [
        {
          path: "/changepassword",
          // component: ChangePassword,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/ProfilePage/ChangePassword");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/changeemail",
          // component: SetEmail,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/ProfilePage/SetEmail");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/makeaccount",
          // component: SetGuestAccount,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/ProfilePage/SetGuestAccount");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
      ],
    },
    {
      path: "/journal",
      // component: JournalHomePage,
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/NewJournalPage/JournalHomePage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
      routes: [
        {
          path: "/write",
          // component: JournalPage,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/NewJournalPage/JournalPage");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/read",
          // component: ReadJournalPage,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/NewJournalPage/ReadJournalPage");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/entries/:id",
          // component: DetailedJournalPage,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () =>
              import("./pages/NewJournalPage/DetailedJournalPage");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
      ],
    },
    {
      path: "/vinyl",
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/VinylPage");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
    },
    {
      path: "/papercups",
      // component: PaperCupsHome,
      async: (to: any, from: any, res: any, rej: any) => {
        const comp = () => import("./pages/PaperCupsPage/PaperCupsHome");
        comp().then((rc) => {
          res({ component: rc.default });
        });
      },
      routes: [
        {
          path: "/conversations/:id",
          // component: Chat,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/PaperCupsPage/Chat");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/conversations",
          // component: PaperCupsConversations,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/PaperCupsPage/Conversations");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/speak",
          // component: SpeakPage,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/PaperCupsPage/Speak");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
        {
          path: "/listen",
          // component: ListenPage,
          async: (to: any, from: any, res: any, rej: any) => {
            const comp = () => import("./pages/PaperCupsPage/Listen");
            comp().then((rc) => {
              res({ component: rc.default });
            });
          },
        },
      ],
    },
  ],
};

export default () => {
  const doQueuedActions = async () => {
    const needToCreateGuestAccount = await LocalDatabase.isGuestAccountQueued();
    if (needToCreateGuestAccount) {
      const { token, refreshToken, userId } = await loginAsGuest();
      await LocalDatabase.saveAuthToken(token, refreshToken);
      await LocalDatabase.setUserId(userId);
      await LocalDatabase.queueGuestAccount(true);

      ToastService.toastBottom("Your guest account is created!");
    }

    const journalPosts = await LocalDatabase.getCachedJournalPosts();
    if (journalPosts.length > 0) {
      try {
        await Promise.all(
          journalPosts.map(async (post) => {
            const id = post.id;
            if (!id) {
              return;
            }
            await makeJournalPost(post);
            await LocalDatabase.removeQueuedPost(id);
          })
        );
        // all posts are created and cleared.
      } catch (e) {
        // silent ignore
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("offline", () => {
      ToastService.toastBottom("You went offline.");
    });
    window.addEventListener("online", () => {
      ToastService.toastBottom("You went back online! :)");
      doQueuedActions();
    });
  }, []);

  useEffect(() => {
    /**
     * This portion is for doing all queued stuff that hasn't been done yet.
     */
    if (!navigator.onLine) {
      return;
    }
    doQueuedActions();
  }, []);

  useEffect(() => {
    // test login
    (async () => {
      const isOnboarded = await LocalDatabase.isOnboarded(OnboardingTypes.App);
      if (!isOnboarded) {
        f7.views.main.router.navigate("/onboarding");
        return;
      }
      const needToCreateGuestAccount = await LocalDatabase.isGuestAccountQueued();
      if (needToCreateGuestAccount) {
        return;
      }

      try {
        const token = await LocalDatabase.getAuthToken();
        if (token) {
          await reauthenticate(token.refreshToken);
        } else {
          throw new NotLoggedInError();
        }
      } catch (e) {
        if (e instanceof NotLoggedInError) {
          f7.views.main.router.navigate("/login");
        }
      }
    })();
  }, []);

  const backgroundCheck = async () => {
    try {
      const localConversations = await LocalDatabase.getConversations();
      const conversations = await getAllConvos();

      if (localConversations === null || conversations === null) {
        return;
      }

      // check for new convos
      const ownUserId = await LocalDatabase.getUserId();
      const newConvos = conversations
        .filter(
          (convo) =>
            localConversations.findIndex((x) => x.id === convo.id) === -1
        )
        .filter((convo) => {
          const lastMessage = convo.messages[
            convo.messages.length - 1
          ] as Message;
          if (lastMessage.userId === ownUserId) {
            return false;
          }
          return true;
        });
      if (newConvos.length === 1) {
        newConvos.forEach((convo) => {
          NotificationService.notify({
            subtitle: "New conversation",
            text: `New conversation from ${capitalCase(
              convo.otherPartyAlias
            )}! Tap here to listen to it.`,
            onClick: () =>
              f7.views.main.router.navigate(
                `/papercups/conversations/${convo.id}`
              ),
          });
        });
      } else if (newConvos.length > 1) {
        NotificationService.notify({
          subtitle: "New conversations",
          text: `You have multiple new conversations! Tap here to listen to them.`,
          onClick: () =>
            f7.views.main.router.navigate(`/papercups/conversations`),
        });
      }
      for (const convo of localConversations) {
        const localMessageIds = convo.chat;
        const newConvo = await getConvo(convo.id);
        if (!newConvo) {
          continue;
        }
        const newMessages = newConvo.messages
          .filter(
            (msg: Message) =>
              localMessageIds.findIndex((id) => id === msg.id) === -1
          )
          .filter((msg: Message) => {
            return msg.userId !== ownUserId;
          });
        if (newMessages.length > 0) {
          // new message! alert :)
          NotificationService.notify({
            subtitle: "New message",
            text: `You have a new message from ${capitalCase(
              convo.otherPartyAlias
            )}! Tap here to listen to it.`,
            onClick: () =>
              f7.views.main.router.navigate(
                `/papercups/conversations/${convo.id}`
              ),
          });
        }
      }
    } catch (e) {
      if (e instanceof OfflineError) {
        // ignore
      }
    }
  };

  /**
   * Background conversation check
   */
  useInterval(() => {
    backgroundCheck();
  }, 30000);

  useEffect(() => {
    backgroundCheck();
  }, []);

  return (
    <App params={f7params}>
      <SidePanel />
      <View main pushState pushStateSeparator="" />
    </App>
  );
};
