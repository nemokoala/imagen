const sendDiscordMessage = async (
  webhookUrl: string | undefined,
  message: string,
  webhookType: "normal" | "error"
): Promise<boolean> => {
  const NODE_ENV = process.env.NODE_ENV || "unknown";
  const envVarName =
    webhookType === "normal" ? "DISCORD_NORMAL_URL" : "DISCORD_ERROR_URL";
  const webhookName = webhookType === "normal" ? "webhook" : "error webhook";

  if (!webhookUrl) {
    console.error(`${envVarName} is not set`);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: `${NODE_ENV} - ${message}` }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Discord ${webhookName} failed: ${response.status} ${response.statusText}`,
        errorText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Discord ${webhookName} error:`, error);
    return false;
  }
};

export const discordService = {
  sendLog: async (message: string) => {
    return sendDiscordMessage(
      process.env.DISCORD_NORMAL_URL,
      message,
      "normal"
    );
  },

  sendError: async (message: string) => {
    return sendDiscordMessage(process.env.DISCORD_ERROR_URL, message, "error");
  },
};
