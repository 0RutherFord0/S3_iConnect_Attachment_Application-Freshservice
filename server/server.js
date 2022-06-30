// function uploadToS3(conversation) {
//   /*
//     conversation: {
//       conversations: [
//         {
//           ticket_id,
//           id, // conversation_id
//           attachments : [
//             {
//               name,
//               attachment_url
//             }
//           ]
//         }
//       ]
//     }
//   */
//   var s3_url = `https://nodejs.adityatawade.com/s3_upload`;
//   var s3_options = {
//     json: {
//       conversation: conversation,
//     },
//   };
//   console.log("DATA", s3_options.json);

//   $request.post(s3_url, s3_options).then(
//     function (data) {
//       console.log("S3 Response:", data.response);
//     },
//     function (error) {
//       console.log(error);
//     }
//   );
// }

exports = {
  onTicketCreateCallback: function (payload) {
    var headers = {
      Authorization: "Basic <%= encode('UfFTA68X62IYm3LCUWT') %>",
    };
    var ticketID = payload.data.ticket.id;
    console.log("Ticket ID", ticketID);
    var options = { headers: headers };
    var url = `https://iconnectsolutionspvtltd.freshservice.com/api/v2/tickets/${ticketID}`;
    $request.get(url, options).then(
      function (data) {
        data = JSON.parse(data.response);
        const conversation = {
          conversations: [
            {
              ticket_id: data.ticket.id,
              id: "main",
              attachments: data.ticket.attachments,
            },
          ],
        };
        // uploadToS3(datas);
        var s3_url = `https://nodejs.adityatawade.com/s3_upload`;
        var s3_options = {
          json: {
            conversation: conversation,
          },
        };
        console.log("DATA", s3_options.json);

        $request.post(s3_url, s3_options).then(
          function (data) {
            console.log("S3 Response:", data.response);
          },
          function (error) {
            console.log(error);
          }
        );
      },
      function (error) {
        console.log(error);
      }
    );
  },
  onConversationCreateCallback: function (payload) {
    var headers = {
      Authorization: "Basic <%= encode('UfFTA68X62IYm3LCUWT') %>",
    };
    var options = { headers: headers };

    var ticketID = payload.data.conversation.ticket_id;
    var attachmentsID = payload.data.conversation.attachments.map((x) => x.id);
    var slice_TP = attachmentsID.join("\n\n");
    var fileName = payload.data.conversation.attachments.map((x) => x.name);
    console.log("Ticket ID:", ticketID);
    var slice_fileName = fileName.join("\n\n");
    console.log("TP ID:", slice_TP);
    console.log("File Name:", slice_fileName);

    var url = `https://iconnectsolutionspvtltd.freshservice.com/api/v2/tickets/${ticketID}/conversations`;
    $request
      .get(url, options)
      .then(
        function (data) {
          data = JSON.parse(data.response);
          return data;
        },
        function (error) {
          console.log(error);
        }
      )
      .then((conversation) => {
        // uploadToS3(conversation);
        var s3_url = `https://nodejs.adityatawade.com/s3_upload`;
        var s3_options = {
          json: {
            conversation: conversation,
          },
        };
        console.log("DATA", s3_options.json);

        $request.post(s3_url, s3_options).then(
          function (data) {
            console.log("S3 Response:", data.response);
          },
          function (error) {
            console.log(error);
          }
        );
      });
  },
};
