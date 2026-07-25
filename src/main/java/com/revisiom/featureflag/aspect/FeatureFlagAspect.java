package com.revisiom.featureflag.aspect;

import com.revisiom.featureflag.annotation.RequireFeature;
import com.revisiom.featureflag.exception.FeatureDisabledException;
import com.revisiom.featureflag.strategy.FeatureEvaluator;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class FeatureFlagAspect {

    private final List<FeatureEvaluator> evaluators;

    public FeatureFlagAspect(List<FeatureEvaluator> evaluators) {
        this.evaluators = evaluators;
    }

    @Around("@annotation(com.revision.featureflag.annotation.RequiresFeature) && @annotation(requiresFeature)")
    public Object checkFeatureToggle(ProceedingJoinPoint joinPoint, RequireFeature requiresFeature) throws Throwable {
        String featureKey = requiresFeature.value();

        boolean isEnabled = evaluators.stream()
                .anyMatch(evaluator -> evaluator.isEnabled(featureKey));

        if (!isEnabled) {
            throw new FeatureDisabledException(featureKey);
        }

        return joinPoint.proceed();
    }
}