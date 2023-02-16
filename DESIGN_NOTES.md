There are three places a transaction can be created from:

- Statemint, Statemine (Common good parachain)
- Relay Chain
- Parachain

1. `XcmVersionedMultiLocation`
- Requires destination id
- Parents
    - with
        - requires us to query the relay chain Id and relevant information 
    - without
        - Parents set to 0
- Account id
- What versions of xcm are we using. Such as V1, V2, V3 and what do we support, and how to do we build the code to make it easy to switch.

2. `XcmVersionedXcm`
- Requires the call to.
- Requires the Weight
- Requires the origin type

3. `SignedPayload`.send
- After the user signs the payload, allow them to send. 
- Creates a new SubmittableExtrinsic type to send. 


`reserveTransferAssets`

Moonbeam -> MoonBeam Soveriegn Statemint account -> Bifrost Soveriegn Statemint account -> Bifrost will mint a wrapped version of the amount on the bifrost statemint soveriegn account. 


