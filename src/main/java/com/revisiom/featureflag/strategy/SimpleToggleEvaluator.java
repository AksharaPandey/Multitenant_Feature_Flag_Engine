package com.revisiom.featureflag.strategy;


import org.springframework.stereotype.Component;
import java.util.Map;
@Component
public class SimpleToggleEvaluator implements FeatureEvaluator {
    private final Map<String,Boolean> featureFlags=Map.of(
            "NEW_PAYMENT_GATEWAY", true,
            "BETA_RECOMMENDATIONS", false
    );
    @Override
    public boolean isEnabled(String featureKey){
        return featureFlags.getOrDefault(featureKey,false);
    }
}
