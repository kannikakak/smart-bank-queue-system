package com.smartq.api.catalog.repository;

import com.smartq.api.catalog.domain.ServiceOffering;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findAllByOrderByNameAsc();

    List<ServiceOffering> findByActiveTrueOrderByNameAsc();

    Optional<ServiceOffering> findByIdAndActiveTrue(Long id);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    long countByActiveTrue();
}
