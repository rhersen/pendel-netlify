import fetch from "node-fetch"

export async function handler() {
  try {
    const response = await fetch("http://api.trafikinfo.trafikverket.se/v1.2/data.json",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/xml'
        },
        body: `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
  <QUERY objecttype='TrainAnnouncement'>
    <FILTER>
      <AND>
        <IN name='ProductInformation' value='Pendeltåg' />
        <EQ name='ActivityType' value='Avgang' />
        <GT name='AdvertisedTimeAtLocation' value='$dateadd(0:00:00)' />
        <LT name='AdvertisedTimeAtLocation' value='$dateadd(0:19:00)' />
      </AND>
    </FILTER>
    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
  </QUERY>
</REQUEST>`
      })
    if (!response.ok) {
      return {statusCode: response.status, body: response.statusText}
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data.RESPONSE.RESULT[0])
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500, body: JSON.stringify({msg: err.message})
    }
  }
}
