package com.shopthoitrangnts.component;
import com.shopthoitrangnts.utils.WebUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.Locale;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocalizationUtils {
    MessageSource messageSource;
    LocaleResolver localeResolver;

    public String getLocalizedMessage(String messageKey, Object ... params){
        HttpServletRequest request = WebUtils.getCurrentRequest();
        Locale locale = localeResolver.resolveLocale(request);
        return messageSource.getMessage(messageKey, params , locale);
    }
}
