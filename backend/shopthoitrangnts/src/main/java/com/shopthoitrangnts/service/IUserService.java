package com.shopthoitrangnts.service;

import com.shopthoitrangnts.dto.UserDTO;
import com.shopthoitrangnts.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;

    String login(String phoneNumber, String password) throws Exception;

}
