const request = require("request")

export function handler(event, context, callback) {
  request.post(
    "http://api.trafikinfo.trafikverket.se/v1.2/data.json",
    {
      body: `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
  <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation'>
    <FILTER>
      <AND>
        <IN name='ProductInformation' value='Pendeltåg' />
        <EQ name='AdvertisedTrainIdent' value='2318' />
        <GT name='AdvertisedTimeAtLocation' value='$dateadd(-6:00:00)' />
        <LT name='AdvertisedTimeAtLocation' value='$dateadd(6:00:00)' />
      </AND>
    </FILTER>
    <INCLUDE>ActivityType</INCLUDE>
    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
    <INCLUDE>TimeAtLocation</INCLUDE>
    <INCLUDE>ToLocation</INCLUDE>
  </QUERY>
</REQUEST>`,
      headers: {
        "Content-Type": "application/xml"
      }
    },
    (error, res) => {
      if (error) {
        callback(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      callback(null, {
        statusCode: 200,
        body: res.body
      })
    }
  )
}
