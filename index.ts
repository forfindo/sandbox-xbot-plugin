import type {IPlugin, PluginContext, ExecResult} from "@xopenbot/plugin";
import {init, exec, saveCtx} from "@xopenbot/sandbox"
import type {Bot, MessageEvent} from "@xopenbot/onebot";

const plugin: IPlugin = {
  info: {
    name: "sandbox",
    version: "1.0.0",
    description: "js沙箱"
  },
  async init(ctx: PluginContext) {
    // @ts-ignore
    await init([ctx.bot], {
      master: ['3530766280']
    })
    return {};
  },
  loadCommand(ctx: PluginContext) {
    return [
      {
        name: "exec",
        pattern: /(?:)/,
        priority: 9,
        execute: function (input: string, ctx: PluginContext, args?: string[]) {
          const event = ctx.raw_event as MessageEvent;
          exec({
            ...event
          }).then(result => {
            if (result) {
              (ctx.bot as Bot).sendMessage(event.detail_type, event.group_id as string ?? event.user_id, result)
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
}

export default plugin;