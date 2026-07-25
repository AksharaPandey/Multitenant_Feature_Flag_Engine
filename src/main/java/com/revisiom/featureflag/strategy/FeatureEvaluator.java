package com.revisiom.featureflag.strategy;

public interface FeatureEvaluator {
    boolean isEnabled(String featureKey);
}
