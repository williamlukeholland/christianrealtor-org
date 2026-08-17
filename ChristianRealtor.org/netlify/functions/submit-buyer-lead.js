// Netlify Function: forwards Personalized Home List requests to Follow Up Boss
// Endpoint: /.netlify/functions/submit-buyer-lead

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      name         = "",
      email        = "",
      phone        = "",
      preferred_area = "",
      price_range  = "",
      bedrooms     = "",
      bathrooms    = "",
      timeline     = "",
      priorities   = "",
      message      = "",
    } = data;

    // Split name into first/last for FUB person record
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName  = nameParts.slice(1).join(" ") || "";

    // Build structured message FUB will display on the contact record
    let messageParts = ["PERSONALIZED HOME LIST REQUEST — christianrealtor.org"];
    if (preferred_area) messageParts.push(`Preferred Area: ${preferred_area}`);
    if (price_range)    messageParts.push(`Price Range: ${price_range}`);
    if (bedrooms)       messageParts.push(`Bedrooms: ${bedrooms}`);
    if (bathrooms)      messageParts.push(`Bathrooms: ${bathrooms}`);
    if (timeline)       messageParts.push(`Timeline: ${timeline}`);
    if (priorities)     messageParts.push(`Priorities: ${priorities}`);
    if (message)        messageParts.push(`Additional Notes: ${message}`);

    const fullMessage = messageParts.join("\n");

    const payload = {
      source:  "christianrealtor.org — Buying Page",
      system:  "Custom Website",
      type:    "General Inquiry",
      message: fullMessage,
      person: {
        firstName: firstName,
        lastName:  lastName,
        emails:    email ? [{ value: email }] : [],
        phones:    phone ? [{ value: phone }] : [],
        tags:      ["Buyer", "Home List Request"],
        customFields: [
          { name: "Preferred Area", value: preferred_area },
          { name: "Price Range",    value: price_range },
        ].filter(f => f.value),
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
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Basic ${auth}`,
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
