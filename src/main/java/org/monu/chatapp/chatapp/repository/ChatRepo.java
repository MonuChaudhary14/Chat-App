package org.monu.chatapp.chatapp.repository;

import org.monu.chatapp.chatapp.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepo extends JpaRepository<ChatEntity, Long> {

}