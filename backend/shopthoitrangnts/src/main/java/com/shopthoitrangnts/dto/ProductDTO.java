package com.shopthoitrangnts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    @NotNull(message = "Vui lòng nhập tên sản phẩm")
    @Size(min = 3, max = 200, message = "Tên sản phẩm chứa từ 3 đến 200 ký tự")
    private String name;
    @Min(value = 0, message = "Giá phải lớn hơn 0")
    @Max(value = 10000000, message = "Giá nhỏ hơn 10.000.000")
    private Float price;
    private String thumbnail;
    private String description;
    @JsonProperty("category_id")
    private Long categoryId;

}
