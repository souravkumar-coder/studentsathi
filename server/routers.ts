import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  assistant: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1).max(1200),
        language: z.enum(["en", "hi"]),
        profile: z.object({
          educationLevel: z.string(),
          course: z.string(),
          state: z.string(),
          category: z.string(),
          incomeBand: z.string(),
        }),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "claude-haiku-4-5",
          max_tokens: 420,
          messages: [
            {
              role: "system",
              content: `You are Sathi, a careful StudentSathi guidance assistant. Respond in ${input.language === "hi" ? "clear Hindi (Devanagari), with occasional English scholarship terms where helpful" : "clear English"}. Give practical, short, encouraging planning guidance for Indian students. You may use the provided local student profile, but never invent live scholarship, government, provider, deadline, application link, or document-verification facts. State that official provider criteria must be checked when relevant. Do not request passwords, OTPs, Aadhaar numbers, bank-account details, or uploads in chat. This is general educational guidance, not legal, financial, or eligibility approval advice.`,
            },
            { role: "user", content: `Student profile: ${JSON.stringify(input.profile)}\n\nStudent question: ${input.message}` },
          ],
        });
        const content = response.choices[0]?.message?.content;
        return { reply: typeof content === "string" && content.trim() ? content.trim() : "Please check the official provider criteria before applying." };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
