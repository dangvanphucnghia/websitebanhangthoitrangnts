package com.shopthoitrangnts.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shopthoitrangnts.entity.User;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("user")
    private User user;
}
