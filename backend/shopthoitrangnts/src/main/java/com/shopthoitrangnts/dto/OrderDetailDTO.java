package com.shopthoitrangnts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {
    @JsonProperty("order_id")
    @Min(value = 1, message = "OrderId > 0")
    private Long orderId;

    @JsonProperty("product_id")
    @Min(value = 1, message = "ProductId > 0")
    private Long productId;
    @Min(value = 0, message = "Giá >= 0")
    private Float price;
    @JsonProperty("number_of_products")
    @Min(value = 1, message = "Số sản phẩm >= 1")
    private int numberOfProducts;
    @Min(value = 1, message = "Tổng tiền >= 0")
    @JsonProperty("total_money")
    private Float totalMoney;
    private String color;

}
