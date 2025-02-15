package com.shopthoitrangnts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    @JsonProperty("user_id")
    @Min(value = 1, message = "UserId > 0")
    private Long userId;

    @JsonProperty("fullname")
    private String fullName;
    @JsonProperty("email")
    private String email;

    @JsonProperty("phone_number")
    @NotBlank(message = "sdt không được để trống")
    @Size(min = 5, message = "sdt >= 5")
    private String phoneNumber;
    @JsonProperty("address")
    private String address;
    @JsonProperty("note")
    private String note;
     @JsonProperty("total_money")
     @Min(value = 0, message = "Tổng tiền >= 0")
    private Float totalMoney;

     @JsonProperty("shipping_method")
    private String shippingMethod;

     @JsonProperty("shipping_address")
     private String shippingAddress;

    @JsonProperty("shipping_date")
    private LocalDate shippingDate;

     @JsonProperty("payment_method")
    private String paymentMethod;


}
