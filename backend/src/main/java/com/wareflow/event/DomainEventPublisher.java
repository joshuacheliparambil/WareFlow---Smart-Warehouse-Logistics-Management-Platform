package com.wareflow.event;

import com.wareflow.dto.OperationsDtos.EventDto;
import org.slf4j.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class DomainEventPublisher {
  private static final Logger log = LoggerFactory.getLogger(DomainEventPublisher.class);
  private final KafkaTemplate<String, EventDto> kafkaTemplate;

  public DomainEventPublisher(KafkaTemplate<String, EventDto> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void publish(EventDto event) {
    kafkaTemplate.send("wareflow.events", event.aggregateId(), event);
    log.info("published event type={} aggregate={}", event.type(), event.aggregateId());
  }
}
