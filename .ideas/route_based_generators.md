## Context

At the moment, both the NPC and the village generators work entirely client-side and then serialize their data and put it in a query parameter in the URL, e.g. /generators/inhabitant?i=1C9D2SK252.

## Goal

The idea would be to make the serialized data ID a URL parameter to make the URL more resilient and the code simpler. That means the empty route would be /generators/inhabitant, and then once generated it would be generators/inhabitant/1C9D2SK252.

The data deserialization could then happen on the server and the data just passed down to the view, which would make the view much easier. For generator, the view would use a router push to the full route.

## Open questions

- The village builder has more complicated data because it contains the data of its inhabitants as well, so you end up with a few IDs. Potentially, we could have multiple URL params, or just one that’s then split into parts.
- Perhaps we could start with the NPC builder which should be much simpler.
