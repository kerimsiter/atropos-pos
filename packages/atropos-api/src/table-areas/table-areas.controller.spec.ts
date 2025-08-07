import { Test, TestingModule } from '@nestjs/testing';
import { TableAreasController } from './table-areas.controller';

describe('TableAreasController', () => {
  let controller: TableAreasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableAreasController],
    }).compile();

    controller = module.get<TableAreasController>(TableAreasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
