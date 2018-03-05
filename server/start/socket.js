'use strict'

const Ws = use('Ws')

Ws.channel('disconnect', 'App/Ws/Disconnect')
  .channel('users', 'App/Ws/Auth')
  .channel('rooms', 'App/Ws/Rooms')

//Ws.namespace('chat')
//  .channel('disconnect')
