package org.monu.chatapp.chatapp.Handler;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Message {

        private String sender;
        private String message;
        private String receiver;
        private String type;
}
