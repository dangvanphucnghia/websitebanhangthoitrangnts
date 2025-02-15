package com.shopthoitrangnts.controller;

import com.shopthoitrangnts.component.LocalizationUtils;
import com.shopthoitrangnts.dto.CategoryDTO;
import com.shopthoitrangnts.entity.Category;
import com.shopthoitrangnts.response.CategoryResponse;
import com.shopthoitrangnts.service.CategoryService;
import com.shopthoitrangnts.utils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;
    MessageSource messageSource;
    LocaleResolver localeResolver;
    LocalizationUtils localizationUtils;
    @PostMapping("")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryDTO categoryDTO, BindingResult result){
        if(result.hasErrors()){
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(CategoryResponse
                    .builder()
                    .message(errorMessages.toString()).build());
        }
        categoryService.createCategory(categoryDTO);
        return  ResponseEntity.ok(CategoryResponse.builder()
                        .message(localizationUtils.getLocalizedMessage(MessageKeys.INSERT_CATEGORY_SUCCESSFULLY))
                .build());
    }
    //Hiển thị tất cả các categories
    @GetMapping("")
    public ResponseEntity<?> getAllCategories(@RequestParam("page") int page, @RequestParam("limit") int limit ){
        List<Category> categories = categoryService.getAllCategories();
        return  ResponseEntity.ok(categories);
    }



    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategories(@PathVariable Long id,
                                                                   @Valid @RequestBody  CategoryDTO categoryDTO,
                                                                   HttpServletRequest request){
        categoryService.updateCategory(id, categoryDTO);
        Locale locale = localeResolver.resolveLocale(request);
        return  ResponseEntity.ok(CategoryResponse.builder()
                        .message(localizationUtils.getLocalizedMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryResponse> deleteCategories(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return  ResponseEntity.ok(CategoryResponse.builder()
                        .message(localizationUtils.getLocalizedMessage(MessageKeys.DELETE_CATEGORY_SUCCESSFULLY))
                .build());
    }
}
