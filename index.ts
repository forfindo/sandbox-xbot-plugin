import {type ExecResult, definePlugin} from "@xopenbot/plugin";
import {init, exec, saveCtx} from "@xopenbot/sandbox"
import type {MessageEvent} from "@xopenbot/onebot";

const plugin = definePlugin({
  info: {
    name: "sandbox",
    version: "1.0.0",
    description: "js沙箱",
    manifest: {
      depsOn: {
        sendGroupMessage: 'function',
        sendPrivateMessage: 'function',
        getSelfInfo: 'function',
        deleteMessage: 'function',
        getMessage: 'function',
        getGroupList: 'function',
        getGroupMemberList: 'function',
        leaveGroup: 'function'
      }
    }
  },
  async init(ctx) {
    // @ts-ignore
    await init([ctx.bot], {
      master: ['3530766280'],
      botAPI: ["getMessage"]
    })
    return {};
  },
  loadCommand(ctx) {
    return [
      {
        name: "exec",
        pattern: /(?:)/,
        priority: 9,
        execute: function (input: string, ctx, args?: string[]) {
          const event = ctx.raw_event as MessageEvent;
          exec({
            ...event
          }).then(result => {
            if (result && !(Array.isArray(result) && result.length === 0)) {
              if (event.group_id) {
                ctx.bot.sendGroupMessage(String(event.group_id), result);
              } else if (event.user_id) {
                ctx.bot.sendPrivateMessage(event.user_id, result);
              }
            }
          })
          return {
            next: true
          };
        }
      },
      {
        name: "save",
        pattern: /^sandbox\s+save/,
        priority: 9,
        execute: function (): Promise<ExecResult | undefined> | ExecResult | undefined {
          saveCtx();
          return {
            content: [
              {
                type: 'text',
                text: new Date().toLocaleString()
              }
            ]
          }
        }
      }
    ];
  }
})

export default plugin;