// Netlify Function: forwards contact form submissions to Follow Up Boss
// Endpoint becomes available at: /.netlify/functions/submit-to-fub

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      first_name = "",
      last_name = "",
      email = "",
      phone = "",
      interest = "",
      message = "",
    } = data;

    // Build the message Follow Up Boss will see
    let fullMessage = message || "";
    if (interest) {
      fullMessage = `Interested in: ${interest}\n\n${fullMessage}`;
    }

    // Determine event type and tags based on interest
    let eventType = "General Inquiry";
    let tags = [];

    switch (interest) {
      case "Buying a Home":
        tags = ["Buyer"];
        eventType = "General Inquiry";
        break;
      case "Selling my Home":
        tags = ["Seller"];
        eventType = "Seller Inquiry";
        break;
      case "Both Buying & Selling":
        tags = ["Buyer", "Seller"];
        eventType = "Seller Inquiry";
        break;
      case "Investment Property":
        tags = ["Buyer"];
        eventType = "General Inquiry";
        break;
      case "Just Exploring":
        tags = ["Buyer", "Seller"];
        eventType = "General Inquiry";
        break;
      default:
        tags = [];
        eventType = "General Inquiry";
    }

    const payload = {
      source: "christianrealtor.org",
      system: "Custom Website",
      type: eventType,
      message: fullMessage,
      person: {
        firstName: first_name,
        lastName: last_name,
        emails: email ? [{ value: email }] : [],
        phones: phone ? [{ value: phone }] : [],
        tags: tags,
      },
    };

    const apiKey = process.env.FUB_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfiguration: missing API key" }),
      };
    }

    const auth = Buffer.from(`${apiKey}:`).toString("base64");

    const fubResponse = await fetch("https://api.followupboss.com/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!fubResponse.ok) {
      const errText = await fubResponse.text();
      return {
        statusCode: fubResponse.status,
        body: JSON.stringify({ error: "Follow Up Boss rejected the request", details: errText }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error", details: err.message }),
    };
  }
};
