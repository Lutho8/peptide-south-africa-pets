import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const UNIT_PRICE = 395;
const SHIPPING_PRICE = 89;
const FREE_SHIPPING_THRESHOLD = 1500;
const CURRENCY = "ZAR";
const POLICY_VERSION = "pets-checkout-2026-09-01";
const REPORT_SCOPE_VERSION = "pets-report-scope-2026-09-01";

const CONSENT_STATEMENTS = {
  age:
    "I confirm that I am 18 years of age or older and authorised to place this order.",
  nutritionalScope:
    "I understand Mobility Collagen is a pet nutritional supplement, not a veterinary medicine or a substitute for veterinary diagnosis or treatment.",
  labelUse:
    "I will use the product only as directed on its label and will consult a veterinarian for illness, injury, medicine interactions or persistent symptoms.",
  reportScope:
    "I understand that any published report describes only the identified sample and test method and does not guarantee an outcome for an individual animal.",
};

const ALLOWED_ORIGINS = new Set([
  "https://pets.peptide-south-africa.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const corsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://pets.peptide-south-africa.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-pets-session-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
};

const json = (request: Request, body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { ...corsHeaders(request), "Cache-Control": "private, no-store" },
  });

type CheckoutConsent = {
  policyVersion?: unknown;
  reportScopeVersion?: unknown;
  ageConfirmed?: unknown;
  nutritionalScopeAcknowledged?: unknown;
  labelUseAcknowledged?: unknown;
  reportScopeAcknowledged?: unknown;
  marketingConsent?: unknown;
  clientAcceptedAt?: unknown;
};

type CheckoutBody = {
  requestId?: unknown;
  selections?: Array<{ kind?: unknown; slug?: unknown; quantity?: unknown }>;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  consent?: CheckoutConsent;
  fulfilment?: {
    phone?: unknown;
    address_line_1?: unknown;
    city?: unknown;
    province?: unknown;
    postal_code?: unknown;
    pet_name?: unknown;
    pet_species?: unknown;
  };
};

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean.length > 0 && clean.length <= max ? clean : null;
}

function validConsent(value: CheckoutConsent | undefined): value is Required<CheckoutConsent> {
  if (!value) return false;
  const acceptedAt =
    typeof value.clientAcceptedAt === "string" ? Date.parse(value.clientAcceptedAt) : NaN;
  return (
    value.policyVersion === POLICY_VERSION &&
    value.reportScopeVersion === REPORT_SCOPE_VERSION &&
    value.ageConfirmed === true &&
    value.nutritionalScopeAcknowledged === true &&
    value.labelUseAcknowledged === true &&
    value.reportScopeAcknowledged === true &&
    typeof value.marketingConsent === "boolean" &&
    Number.isFinite(acceptedAt) &&
    acceptedAt <= Date.now() + 5 * 60 * 1000 &&
    acceptedAt >= Date.now() - 24 * 60 * 60 * 1000
  );
}

function quote(body: CheckoutBody) {
  const lines = body.selections;
  if (!Array.isArray(lines) || lines.length !== 1) {
    throw new Error("Your Pets order must contain Mobility Collagen only.");
  }
  const line = lines[0];
  if (
    line.kind !== "item" ||
    line.slug !== "pets-mobility-collagen" ||
    !Number.isInteger(line.quantity) ||
    Number(line.quantity) < 1 ||
    Number(line.quantity) > 20
  ) {
    throw new Error("Your Pets order contains an invalid product or quantity.");
  }
  const quantity = Number(line.quantity);
  const subtotal = quantity * UNIT_PRICE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  return {
    quantity,
    subtotal,
    shipping,
    total: subtotal + shipping,
    description: `Peptides4Pets: Mobility Collagen x${quantity}`,
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(request, { error: "Your session has expired. Please sign in again." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) throw new Error("Missing server configuration");

    const token = authHeader.slice("Bearer ".length);
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData.user) {
      return json(request, { error: "Your session has expired. Please sign in again." }, 401);
    }

    const body = (await request.json().catch(() => null)) as CheckoutBody | null;
    if (!body) return json(request, { error: "Invalid checkout request." }, 400);
    const requestId = body.requestId;
    if (
      typeof requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)
    ) {
      return json(request, { error: "Invalid checkout request." }, 400);
    }
    if (!validConsent(body.consent)) {
      return json(
        request,
        { error: "Accept the required Pets checkout acknowledgements before placing your order." },
        400,
      );
    }

    let priced;
    try {
      priced = quote(body);
    } catch (error) {
      return json(request, { error: error instanceof Error ? error.message : "Invalid cart." }, 400);
    }

    const firstName = cleanText(body.firstName, 80);
    const lastName = cleanText(body.lastName, 80);
    const email = cleanText(body.email, 320)?.toLowerCase();
    const phone = cleanText(body.fulfilment?.phone, 32);
    const addressLine1 = cleanText(body.fulfilment?.address_line_1, 180);
    const city = cleanText(body.fulfilment?.city, 100);
    const province = cleanText(body.fulfilment?.province, 100);
    const postalCode = cleanText(body.fulfilment?.postal_code, 12);
    const petName = cleanText(body.fulfilment?.pet_name, 120);
    const petSpecies = cleanText(body.fulfilment?.pet_species, 20);
    if (
      !firstName || !lastName || !email || !phone || !addressLine1 || !city || !province ||
      !postalCode || !/^\d{4}$/.test(postalCode) || !petName ||
      !petSpecies || !["dog", "cat", "horse"].includes(petSpecies)
    ) {
      return json(request, { error: "Complete every delivery and pet field." }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const orderPayload = {
      user_id: userData.user.id,
      checkout_request_id: requestId,
      total: priced.total,
      discount_code: null,
      status: "pending",
      currency: CURRENCY,
      payment_provider: "eft_capitec",
      order_description: priced.description,
      shipping_country: "ZA",
      shipping_method: "local_courier",
      shipping_cost: priced.shipping,
      shipping_currency: CURRENCY,
      free_shipping_applied: priced.shipping === 0,
      customer_name: `${firstName} ${lastName}`,
      customer_email: email,
      customer_phone: phone,
      shipping_address: {
        address_line_1: addressLine1,
        city,
        province,
        postal_code: postalCode,
        country: "ZA",
      },
      order_items: [
        {
          storefront: "pets.peptide-south-africa.com",
          slug: "pets-mobility-collagen",
          name: "Mobility Collagen",
          quantity: priced.quantity,
          unit_price: UNIT_PRICE,
          line_total: priced.subtotal,
        },
      ],
    };

    let { data: order, error: orderError } = await admin
      .from("orders")
      .select("id,user_id,total,currency,order_description")
      .eq("checkout_request_id", requestId)
      .maybeSingle();

    let created = false;
    if (!order && !orderError) {
      const inserted = await admin
        .from("orders")
        .insert(orderPayload)
        .select("id,user_id,total,currency,order_description")
        .single();
      order = inserted.data;
      orderError = inserted.error;
      created = !inserted.error;
      if (orderError?.code === "23505") {
        const raced = await admin
          .from("orders")
          .select("id,user_id,total,currency,order_description")
          .eq("checkout_request_id", requestId)
          .maybeSingle();
        order = raced.data;
        orderError = raced.error;
        created = false;
      }
    }
    if (orderError || !order) {
      console.error("pets order creation failed", orderError?.code);
      return json(request, { error: "Your Pets order could not be created. Please try again." }, 500);
    }
    if (
      order.user_id !== userData.user.id ||
      String(order.currency).toUpperCase() !== CURRENCY ||
      Math.abs(Number(order.total) - priced.total) > 0.01 ||
      order.order_description !== priced.description
    ) {
      return json(request, { error: "This checkout request conflicts with an earlier cart." }, 409);
    }

    const consentPayload = {
      order_id: order.id,
      user_id: userData.user.id,
      policy_version: POLICY_VERSION,
      report_scope_version: REPORT_SCOPE_VERSION,
      age_confirmed: true,
      nutritional_scope_acknowledged: true,
      label_use_acknowledged: true,
      report_scope_acknowledged: true,
      marketing_consent: body.consent.marketingConsent,
      client_accepted_at: body.consent.clientAcceptedAt,
      statements: CONSENT_STATEMENTS,
      source: "pets_checkout",
    };
    const { data: existingConsent, error: consentLookupError } = await admin
      .from("psa_pets_checkout_consents")
      .select("user_id,policy_version,report_scope_version,marketing_consent")
      .eq("order_id", order.id)
      .maybeSingle();
    if (consentLookupError) throw consentLookupError;
    if (existingConsent) {
      if (
        existingConsent.user_id !== userData.user.id ||
        existingConsent.policy_version !== POLICY_VERSION ||
        existingConsent.report_scope_version !== REPORT_SCOPE_VERSION ||
        existingConsent.marketing_consent !== body.consent.marketingConsent
      ) {
        return json(request, { error: "This checkout consent conflicts with an earlier request." }, 409);
      }
    } else {
      const { error } = await admin.from("psa_pets_checkout_consents").insert(consentPayload);
      if (error) throw error;
    }

    const { data: existingPet, error: petLookupError } = await admin
      .from("psa_pets_order_details")
      .select("user_id,pet_name,pet_species")
      .eq("order_id", order.id)
      .maybeSingle();
    if (petLookupError) throw petLookupError;
    if (existingPet) {
      if (
        existingPet.user_id !== userData.user.id ||
        existingPet.pet_name !== petName ||
        existingPet.pet_species !== petSpecies
      ) {
        return json(request, { error: "This Pets order conflicts with an earlier request." }, 409);
      }
    } else {
      const { error } = await admin.from("psa_pets_order_details").insert({
        order_id: order.id,
        user_id: userData.user.id,
        pet_name: petName,
        pet_species: petSpecies,
      });
      if (error) throw error;
    }

    if (created) {
      const sessionId = cleanText(request.headers.get("x-pets-session-id"), 200) ?? `server-${requestId}`;
      await admin.from("psa_pets_lifecycle_events").insert([
        {
          event: "pets_checkout_consent_accepted",
          session_id: sessionId,
          user_id: userData.user.id,
          order_id: order.id,
          props: { policy_version: POLICY_VERSION, marketing_consent: body.consent.marketingConsent },
        },
        {
          event: "pets_order_created",
          session_id: sessionId,
          user_id: userData.user.id,
          order_id: order.id,
          props: { amount_zar: priced.total, item_count: priced.quantity, storefront: "pets" },
        },
        ...(body.consent.marketingConsent
          ? [{
              event: "pets_marketing_consent_granted",
              session_id: sessionId,
              user_id: userData.user.id,
              order_id: order.id,
              props: { policy_version: POLICY_VERSION },
            }]
          : []),
      ]);
    }

    const settlementResponse = await fetch(`${supabaseUrl}/functions/v1/eft-create-order`, {
      method: "POST",
      headers: { Authorization: authHeader, apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        amount: priced.total,
        itemName: priced.description.slice(0, 100),
        firstName,
        lastName,
        email,
      }),
    });
    const settlement = (await settlementResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;
    if (!settlementResponse.ok || !settlement || settlement.error) {
      return json(
        request,
        {
          error:
            typeof settlement?.error === "string"
              ? settlement.error
              : "EFT order could not be started.",
        },
        settlementResponse.status >= 400 ? settlementResponse.status : 502,
      );
    }

    return json(request, { ...settlement, order_id: order.id, amount: priced.total });
  } catch (error) {
    console.error("pets-eft-create-order failed", error instanceof Error ? error.message : "unknown");
    return json(request, { error: "Checkout is temporarily unavailable. Please try again." }, 500);
  }
});
