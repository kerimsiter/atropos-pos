import { Test, TestingModule } from '@nestjs/testing';
import { TableAreasService } from './table-areas.service';

describe('TableAreasService', () => {
  let service: TableAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableAreasService],
    }).compile();

    service = module.get<TableAreasService>(TableAreasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
