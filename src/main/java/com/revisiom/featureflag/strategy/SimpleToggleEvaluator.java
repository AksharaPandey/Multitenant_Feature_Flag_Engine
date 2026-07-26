package com.revisiom.featureflag.strategy;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimpleToggleEvaluator implements FeatureEvaluator {

    private final Map<String, Boolean> featureFlags = new ConcurrentHashMap<>(Map.of(
            "NEW_PAYMENT_GATEWAY", true,
            "BETA_RECOMMENDATIONS", false
    ));

    @Override
    @Cacheable(value = "featureFlags", key = "#featureKey")
    public boolean isEnabled(String featureKey) {
        return featureFlags.getOrDefault(featureKey, false);
    }

    public Map<String, Boolean> getAllFlags() {
        return featureFlags;
    }

    // Clears cache when a flag status changes so AOP gets the updated value immediately
    @CacheEvict(value = "featureFlags", key = "#featureKey")
    public void toggleFlag(String featureKey, boolean isEnabled) {
        featureFlags.put(featureKey, isEnabled);
    }
}