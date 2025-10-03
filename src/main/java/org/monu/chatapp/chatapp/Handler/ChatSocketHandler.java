package org.monu.chatapp.chatapp.Handler;

import com.google.gson.Gson;
import org.monu.chatapp.chatapp.entity.ChatEntity;
import org.monu.chatapp.chatapp.repository.ChatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSocketHandler extends TextWebSocketHandler {

    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private Gson gson = new Gson();

    @Autowired
    private ChatRepo chatRepo;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String name = getName(session);

        if(name != null){
            sessions.put(name,session);
        }


    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        String name = getName(session);

        if(name != null){
            sessions.remove(name,session);
        }

        System.out.println(status);

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Message jsonMessageToObject = gson.fromJson(message.getPayload(), Message.class);

        String sender = jsonMessageToObject.getSender();
        String receiver = jsonMessageToObject.getReceiver();

        ChatEntity chatEntity = new ChatEntity();
        chatEntity.setSender(sender);
        chatEntity.setReceiver(receiver);
        chatEntity.setMessage(jsonMessageToObject.getMessage());
        chatRepo.save(chatEntity);

        WebSocketSession receiverSession = sessions.get(receiver);

        if(receiverSession != null && receiverSession.isOpen()){

            String objectToJson = gson.toJson(jsonMessageToObject);

            receiverSession.sendMessage(new TextMessage(objectToJson));
        }

    }

    private String getName(WebSocketSession session) {
        String URL = session.getUri().toString();

        String username = null;

        if (URL.contains("username=")) {
            username = URL.substring(URL.indexOf("username=") + 9);

            if (username.contains("&")) {
                username = username.substring(0, username.indexOf("&"));
            }
        }
        return username; // Return the extracted username
    }



}
