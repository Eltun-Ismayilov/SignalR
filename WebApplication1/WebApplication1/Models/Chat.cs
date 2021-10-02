using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SiqnalR.Models
{
    public class ChatHub : Hub
    {

        //Group yeni isdifadeci daxil edirik .
        public async Task EnterGroup(string groupName)
        {
            // Context.ConnectionId ise bize user id verir her requst id tezelenir
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }


        //Groupdan user  cixartmaq .
        public async Task LeaveGroup(string groupName)
        {
            // Context.ConnectionId ise bize user id verir her requst id tezelenir
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task SendMessage(string gruopName,string user, string message)
        {
            await Clients.Group(gruopName).SendAsync("ReceiveMessage", user, message);
        }
    }

}
