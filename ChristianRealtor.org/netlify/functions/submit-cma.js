// Netlify Function: forwards Home Value / CMA requests to Follow Up Boss
// Endpoint: /.netlify/functions/submit-cma

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      first_name   = "",
      last_name    = "",
      email        = "",
      phone        = "",
      property_address = "",
      bedrooms     = "",
      bathrooms    = "",
      timeline     = "",
      notes        = "",
    } = data;

    // Build a rich message FUB will display on the contact record
    let messageParts = ["📋 HOME VALUATION REQUEST — christianrealtor.org"];
    if (property_address) messageParts.push(`Property Address: ${property_address}`);
    if (bedrooms)         messageParts.push(`Bedrooms: ${bedrooms}`);
    if (bathrooms)        messageParts.push(`Bathrooms: ${bathrooms}`);
    if (timeline)         messageParts.push(`Selling Timeline: ${timeline}`);
    if (notes)            messageParts.push(`Notes: ${notes}`);

    const fullMessage = messageParts.join("\n");

    const payload = {
      source: "christianrealtor.org — Home Value Page",
      system: "Custom Website",
      type:   "General Inquiry",
      message: fullMessage,
      person: {
        firstName: first_name,
        lastName:  last_name,
        emails:    email ? [{ value: email }] : [],
        phones:    phone ? [{ value: phone }] : [],
        tags:      ["CMA Request", "Seller", "Home Value Page"],
        customFields: [
          { name: "Property Address", value: property_address },
          { name: "Selling Timeline",  value: timeline },
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
