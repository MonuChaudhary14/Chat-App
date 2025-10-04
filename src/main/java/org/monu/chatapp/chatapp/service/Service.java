package org.monu.chatapp.chatapp.service;

import org.monu.chatapp.chatapp.entity.ChatEntity;
import org.monu.chatapp.chatapp.repository.ChatRepo;

import java.util.ArrayList;
import java.util.List;

public class Service {

    ChatRepo chatRepo;

    public List<ChatEntity> history(String user1, String user2) {
        List<ChatEntity> allMessages = chatRepo.findAll();
        List<ChatEntity> filteredMessages = new ArrayList<>();

        for (ChatEntity message : allMessages) {
            String sender = message.getSender();
            String receiver = message.getReceiver();

            if ((sender.equals(user1) && receiver.equals(user2)) ||
                    (sender.equals(user2) && receiver.equals(user1))) {
                filteredMessages.add(message);
            }
        }

        return filteredMessages;
    }

}
