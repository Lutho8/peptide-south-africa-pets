# Loyal reference review and Peptides4Pets implementation

Reviewed 2 November 2026: https://loyal.com/ and https://loyal.com/for-dog-owners.

## Requested changes prepared for review

- Remove the black scrolling announcement from the shared navigation, including its dismiss/session-storage logic. Keep the research and veterinary boundaries in the educational, product and safety content.
- Replace the static “more…” circles with a dedicated editorial image section after the safety content. Match the observed treatment: warm sand gradient, large fixed sans-serif “More”, italic serif words moving vertically through a clipped window, a 7.5-second cycle, and responsive portrait/landscape composition.
- Use the same word sequence: walks, play, fetch, days, then walks to make the loop seamless. Add a static accessible heading, keyboard-operable pause/play and a static reduced-motion version.
- Keep the existing WhatsApp enquiry placement and campaign-code rules. This section expresses the dog-owner aspiration; it is not product-specific efficacy evidence.
- The visual is an original generated retriever cutout, not Loyal's photography. No dog name, age, testimonial, trial enrolment, clinical team or treatment result is invented.

## What to learn and what to implement next

| Observation from Loyal | Application for Peptides4Pets | Status |
| --- | --- | --- |
| One memorable emotional moment, supported by photography and generous space | The dedicated “More” interlude, with less repetitive ornament around the research explanation | Implemented in this proposal |
| Clear paths for dog owners and veterinary professionals | Keep the education hub distinct from the catalogue; consider a dedicated veterinary resource destination when substantive resources are ready | Recommendation |
| Trust is supported by concrete product-development information | Make your own product-specific evidence, study limitations and batch verification easier to inspect; only show documented milestones that belong to Peptides4Pets products | Existing evidence links retained; broader expansion recommended |
| Aging questions and practical owner resources accompany products | Add a useful veterinarian-conversation checklist and short guides organised around mobility, behaviour and nutrition, drawing on reviewed veterinary sources | Recommendation |
| Real people and identified dogs create familiarity | Use permissioned founder/owner stories and original photos with verifiable context; do not imply an unverified scientific advisory team or clinical programme | Recommendation |
| Safety is explained in the journey instead of relying only on a banner | Preserve the product-category distinctions and veterinary decision boundaries while removing the repeating header strip | Implemented in this proposal |

Loyal's drug-development, regulatory and trial statements describe Loyal's own programmes. Those claims should not be transferred to Peptides4Pets. Match the communication quality to evidence that can actually be shown.

## Validation and release

Extend existing browser tests for a 72px header without a marquee, the accessible animated section, keyboard pause/resume and reduced-motion behaviour. Run both development and prerendered suites, accessibility, build, lint, research-boundary and SEO checks. Review phone and desktop screenshots plus the GitHub/Vercel preview before production release. Existing flyer QR destinations stay unchanged.

## Asset provenance

Built-in image generation was used for `public/dog-owner-more-retriever-v1.webp`. The generated transparent PNG was encoded as WebP with its alpha channel preserved. It is illustrative brand imagery, not a case study.

Prompt: “A single mature golden retriever with a subtly greying muzzle standing in a relaxed natural pose, full body, all four paws and tail visible. Side-on three-quarter view, friendly expression, soft natural studio daylight, authentic fur detail and natural anatomy. Landscape 3:2 asset, transparent background including around fur and paws, narrow margin to avoid clipping. No floor, scenic background, person, accessories, collar, text or watermark. Original photographic-style image for dog-owner education; not a medical before-and-after or testimonial.”
