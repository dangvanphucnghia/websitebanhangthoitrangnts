package com.shopthoitrangnts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shopthoitrangnts.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageDTO {
    @JsonProperty("product_id")
    @Min(value = 1, message = "Product Id > 0")
    private Long productId;

    @Size(min = 5, max=200, message = "Image's name")
    @JsonProperty("image_url")
    private String imageUrl;
}
