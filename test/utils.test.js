import { serializeData } from '../src/utils/serializeDataToMysql';

describe('Utils tests', () => {
    it('Deve formatar a data para o formato do mysql', () => {
        const data = new Date(1999, 0, 11);
        const novaData = serializeData(data);
        expect(novaData).toBe('1999-1-11');
    });
});