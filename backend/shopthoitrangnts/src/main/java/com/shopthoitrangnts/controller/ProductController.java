package com.shopthoitrangnts.controller;

import com.github.javafaker.Faker;
import com.shopthoitrangnts.component.LocalizationUtils;
import com.shopthoitrangnts.dto.ProductDTO;
import com.shopthoitrangnts.dto.ProductImageDTO;
import com.shopthoitrangnts.entity.Product;
import com.shopthoitrangnts.entity.ProductImage;
import com.shopthoitrangnts.response.ProductListResponse;
import com.shopthoitrangnts.response.ProductResponse;
import com.shopthoitrangnts.service.IProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    IProductService productService;
    LocalizationUtils localizationUtils;
    @PostMapping("")
    public ResponseEntity<?> createdProducts(
            @Valid @RequestBody ProductDTO productDTO,
            BindingResult result){


        try{
            if(result.hasErrors()){
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product newProduct = productService.createProduct(productDTO);


            return ResponseEntity.ok(newProduct);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean isImageFile(MultipartFile file){
        String contenType = file.getContentType();
        return contenType != null && contenType.startsWith("image/");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id")Long productId) {
        try{
            Product existingProduct = productService.getProductById(productId);
            return ResponseEntity.ok(ProductResponse.fromProduct(existingProduct));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("")
    public ResponseEntity<ProductListResponse> getAllProducts(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0", name = "category_id") Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam("limit") int limit ){
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("createdAt").descending());
        Page<ProductResponse> productPage = productService.getAllProducts(keyword, categoryId,pageRequest);

        int totalPages = productPage.getTotalPages();
        List<ProductResponse> products = productPage.getContent();
        return  ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .totalPages(totalPages)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducts(@PathVariable long id, @RequestBody ProductDTO productDTO){
        try{
            Product updateProduct = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(updateProduct);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteproducts(@PathVariable long id){
        try{
            productService.deleteProduct(id);
            return ResponseEntity.ok(String.format("Sản phẩm với id = %d đã được xóa thành công", id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    private String storeFile(MultipartFile file) throws IOException {
        if(!isImageFile(file) || file.getOriginalFilename() == null){
            throw new IOException("Định dạng hình ảnh không hợp lệ");
        }
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID().toString() + "_" + filename;
        java.nio.file.Path uploadDir = Paths.get("uploads");
        if(!Files.exists(uploadDir)){
            Files.createDirectories(uploadDir);
        }
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFilename;
    }

    @PostMapping(value ="uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseEntity<?> uploadImages(
            @PathVariable("id") Long productId,
            @RequestParam("files") List<MultipartFile> files) {
        try{
            Product existingProduct = productService.getProductById(productId);
            files = files == null ? new ArrayList<MultipartFile>() :files;
            if(files.size() > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT){
                return ResponseEntity.badRequest().body("Bạn có thể upload tối đa 5 ảnh");
            }
            List<ProductImage> productImages= new ArrayList<>();
            for(MultipartFile file : files)
            {
                if(file.getSize()==0){
                    continue;
                }
                if(file.getSize() > 10*1024*1024){
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .body("File nhỏ hơn 10MB");
                }
                String contentType = file.getContentType();
                if(contentType == null || !contentType.startsWith("image/")){
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .body("Tập tin phải là một ảnh");
                }
                String filename = storeFile(file);
                ProductImage productImage = productService.createProductImage(
                        existingProduct.getId(),
                        ProductImageDTO.builder()
                                .imageUrl(filename)
                                .build());
                productImages.add(productImage);
            }
            return ResponseEntity.ok().body(productImages);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/generateFakeProducts")
    public ResponseEntity<String> generateFakeProducts(){
        // Tạo Faker với locale tiếng Việt
        Faker faker = new Faker(new Locale("vi"));

        // Danh sách tên sản phẩm thời trang tiếng Việt
        String[] productPrefixes = {"Áo thun", "Áo sơ mi", "Quần jean", "Áo khoác", "Quần tây", "Áo polo"};
        String[] productStyles = {"cổ tròn", "cổ tim", "dài tay", "ngắn tay", "ôm body", "form rộng", "cổ bẻ"};
        String[] colors = {"đen", "trắng", "xanh navy", "xám", "be", "xanh rêu"};

        for(int i = 0; i < 1_000; i++) {
            // Tạo tên sản phẩm có ý nghĩa
            String productName = String.format("%s %s %s",
                    productPrefixes[faker.random().nextInt(productPrefixes.length)],
                    productStyles[faker.random().nextInt(productStyles.length)],
                    colors[faker.random().nextInt(colors.length)]
            );

            if(productService.existsByName(productName)){
                continue;
            }

            // Tạo mô tả có ý nghĩa
            String[] descriptions = {
                    "Chất liệu cotton cao cấp, thoáng mát",
                    "Thiết kế hiện đại, phù hợp nhiều phong cách",
                    "Form dáng trẻ trung năng động",
                    "Phù hợp đi làm, đi chơi",
                    "Chất vải mềm mại, thấm hút mồ hôi tốt"
            };
            String description = descriptions[faker.random().nextInt(descriptions.length)];

            ProductDTO productDTO = ProductDTO.builder()
                    .name(productName)
                    .price((float)faker.number().numberBetween(100_000, 1_000_000))
                    .description(description)
                    .thumbnail("")
                    .categoryId((long)faker.number().numberBetween(1, 9))
                    .build();

            try {
                productService.createProduct(productDTO);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.ok("Đã tạo thành công sản phẩm mẫu");
    }
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName){
        try{
            java.nio.file.Path imagePath = Paths.get("uploads/"+imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());
            if(resource.exists()){
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
            }else {
                return ResponseEntity.notFound().build();
            }
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
}
