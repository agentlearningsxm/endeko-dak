import { Minus } from 'lucide-react';
import { useQuoteStore } from '../../../stores/quoteStore';
import { Input } from '../../ui';
import type { SectionBlock } from '../../../types/blocks';

interface SectionBlockComponentProps {
  block: SectionBlock;
}

export function SectionBlockComponent({ block }: SectionBlockComponentProps) {
  const { updateBlock } = useQuoteStore();
  const { data } = block;

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Minus className="h-4 w-4 text-white/50" />
        </div>

        <Input
          value={data.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder="Sectie titel..."
          className="flex-1 text-lg font-semibold"
        />

        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={data.showDivider}
            onChange={(e) => updateBlock(block.id, { showDivider: e.target.checked })}
            className="rounded border-white/30 bg-white/10"
          />
          Lijn
        </label>
      </div>

      {data.showDivider && (
        <div className="mt-4 border-b border-white/[0.2]" />
      )}
    </div>
  );
}
