package com.shopthoitrangnts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLoginDTO {
    @JsonProperty("phone_number")
    @NotBlank(message = "Vui lòng nhập vào số điện thoại")
    private String phoneNumber;

    @NotBlank(message ="Vui lòng điền mật khẩu" )
    private String password;
}
