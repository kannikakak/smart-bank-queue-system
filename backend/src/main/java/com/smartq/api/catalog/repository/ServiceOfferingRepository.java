package com.smartq.api.catalog.repository;

import com.smartq.api.catalog.domain.ServiceOffering;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findByActiveTrueOrderByNameAsc();

    Optional<ServiceOffering> findByIdAndActiveTrue(Long id);
}
