package com.revisiom.featureflag.strategy;


import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import java.util.Map;
@Component
public class SimpleToggleEvaluator implements FeatureEvaluator {
    private final Map<String,Boolean> featureFlags=Map.of(
            "NEW_PAYMENT_GATEWAY", true,
            "BETA_RECOMMENDATIONS", false
    );
    @Override
    @Cacheable(value = "featureFlags", key = "#featureKey")
    public boolean isEnabled(String featureKey){
        System.out.println("Fetching feature status from source for: " + featureKey);
        return featureFlags.getOrDefault(featureKey,false);
    }
}
