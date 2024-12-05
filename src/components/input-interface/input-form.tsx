'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SimulationInput, InputFormProps } from './types';
import { formatSimulationInput } from './helpers';
import { useAppDispatch } from '@/store/store';
import { setSimulationInputs, startSimulation } from '@/store/simulation-slice';

// Import JSON data with types
import sectors from '@/lib/data/sectors.json';
import nations from '@/lib/data/nations.json';
import disruptions from '@/lib/data/disruption_patterns.json';
import businessModels from '@/lib/data/business_models.json';
import teamArchetypes from '@/lib/data/team_archetypes.json';
import presets from '@/lib/data/presets.json';
import type {
  SectorsData,
  NationsData,
  DisruptionPatternsData,
  BusinessModelsData,
  TeamArchetypesData,
} from '@/lib/data/types';

// Type assertions for JSON data
const sectorsData = sectors as SectorsData;
const nationsData = nations as NationsData;
const disruptionsData = disruptions as DisruptionPatternsData;
const businessModelsData = businessModels as BusinessModelsData;
const teamArchetypesData = teamArchetypes as TeamArchetypesData;

const formSchema = z.object({
  sector: z.string().min(1, 'Sector is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed && typeof parsed === 'object' && 'id' in parsed;
    } catch {
      return false;
    }
  }, 'Invalid sector data'),
  nation: z.string().min(1, 'Nation is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed && typeof parsed === 'object' && 'id' in parsed;
    } catch {
      return false;
    }
  }, 'Invalid nation data'),
  aiDisruptionPattern: z.string().min(1, 'AI Disruption Pattern is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed && typeof parsed === 'object' && 'id' in parsed;
    } catch {
      return false;
    }
  }, 'Invalid AI disruption pattern data'),
  businessModel: z.string().min(1, 'Business Model is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed && typeof parsed === 'object' && 'id' in parsed;
    } catch {
      return false;
    }
  }, 'Invalid business model data'),
  teamArchetype: z.string().min(1, 'Team Archetype is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed && typeof parsed === 'object' && 'id' in parsed;
    } catch {
      return false;
    }
  }, 'Invalid team archetype data'),
  startupPitch: z.string().min(10, 'Startup pitch must be at least 10 characters'),
});

export function InputForm({ onSubmit: propOnSubmit, isLoading = false }: InputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: '',
      nation: '',
      aiDisruptionPattern: '',
      businessModel: '',
      teamArchetype: '',
      startupPitch: '',
    },
  });

  const dispatch = useAppDispatch();

  const loadPreset = (presetId: string) => {
    const preset = presets.presets.find(p => p.id === presetId);
    if (!preset) return;

    console.log('Loading preset:', preset);

    // Find the corresponding objects from their respective data sources
    const sector = sectorsData.sectors.find(s => 
      s.name.toLowerCase() === preset.input.sector.toLowerCase()
    );
    console.log('Matching sector:', sector, 'for input:', preset.input.sector);

    const nation = nationsData.nations.find(n => 
      n.name.toLowerCase() === preset.input.nation.toLowerCase()
    );
    console.log('Matching nation:', nation, 'for input:', preset.input.nation);

    const pattern = disruptionsData.aiDisruptionPatterns.find(p => 
      p.name.toLowerCase() === preset.input.aiDisruptionPattern.toLowerCase()
    );
    console.log('Matching pattern:', pattern, 'for input:', preset.input.aiDisruptionPattern);

    const model = businessModelsData.businessModels.find(m => 
      m.name.toLowerCase().replace('&', 'and') === preset.input.businessModel.toLowerCase().replace('&', 'and')
    );
    console.log('Matching model:', model, 'for input:', preset.input.businessModel);

    // More flexible matching for team archetype
    const archetype = teamArchetypesData.startupTeamArchetypes.find(a => 
      a.name.toLowerCase().includes(preset.input.teamArchetype.toLowerCase()) ||
      preset.input.teamArchetype.toLowerCase().includes(a.name.toLowerCase().replace('the ', '').replace(' team', ''))
    );
    console.log('Matching archetype:', archetype, 'for input:', preset.input.teamArchetype);

    // Update form values with null checks
    if (sector) {
      console.log('Setting sector:', JSON.stringify(sector));
      form.setValue('sector', JSON.stringify(sector), { shouldValidate: true });
    } else {
      console.warn('Could not find matching sector');
    }

    if (nation) {
      console.log('Setting nation:', JSON.stringify(nation));
      form.setValue('nation', JSON.stringify(nation), { shouldValidate: true });
    } else {
      console.warn('Could not find matching nation');
    }

    if (pattern) {
      console.log('Setting pattern:', JSON.stringify(pattern));
      form.setValue('aiDisruptionPattern', JSON.stringify(pattern), { shouldValidate: true });
    } else {
      console.warn('Could not find matching AI disruption pattern');
    }

    if (model) {
      console.log('Setting model:', JSON.stringify(model));
      form.setValue('businessModel', JSON.stringify(model), { shouldValidate: true });
    } else {
      console.warn('Could not find matching business model');
    }

    if (archetype) {
      console.log('Setting archetype:', JSON.stringify(archetype));
      form.setValue('teamArchetype', JSON.stringify(archetype), { shouldValidate: true });
    } else {
      console.warn('Could not find matching team archetype');
    }

    // Always set the pitch since it doesn't need matching
    form.setValue('startupPitch', preset.input.startupPitch, { shouldValidate: true });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedData = formatSimulationInput(values as SimulationInput);
      dispatch(setSimulationInputs(formattedData));
      dispatch(startSimulation());

      await propOnSubmit(formattedData);
    } catch (error) {
      console.error('Simulation error:', error);
      // TODO: Add error handling UI feedback
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="mb-6">
            <FormLabel>Load Preset</FormLabel>
            <Select
              onValueChange={loadPreset}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset configuration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {presets.presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name} - {preset.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sector</FormLabel>
                <Select 
                  value={field.value ? JSON.parse(field.value).id : ''}
                  onValueChange={(value) => {
                    const selectedSector = sectorsData.sectors.find(s => s.id === value);
                    if (selectedSector) {
                      field.onChange(JSON.stringify(selectedSector));
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectorsData.sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nation</FormLabel>
                <Select 
                  value={field.value ? JSON.parse(field.value).id : ''}
                  onValueChange={(value) => {
                    const selectedNation = nationsData.nations.find(n => n.id === value);
                    if (selectedNation) {
                      field.onChange(JSON.stringify(selectedNation));
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a nation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nationsData.nations.map((nation) => (
                      <SelectItem key={nation.id} value={nation.id}>
                        {nation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aiDisruptionPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Disruption Pattern</FormLabel>
                <Select 
                  value={field.value ? JSON.parse(field.value).id.toString() : ''}
                  onValueChange={(value) => {
                    const selectedPattern = disruptionsData.aiDisruptionPatterns.find(p => p.id.toString() === value);
                    if (selectedPattern) {
                      field.onChange(JSON.stringify(selectedPattern));
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a disruption pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disruptionsData.aiDisruptionPatterns.map((pattern) => (
                      <SelectItem key={pattern.id} value={pattern.id.toString()}>
                        {pattern.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Model</FormLabel>
                <Select 
                  value={field.value ? JSON.parse(field.value).id.toString() : ''}
                  onValueChange={(value) => {
                    const selectedModel = businessModelsData.businessModels.find(m => m.id.toString() === value);
                    if (selectedModel) {
                      field.onChange(JSON.stringify(selectedModel));
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a business model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessModelsData.businessModels.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamArchetype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Archetype</FormLabel>
                <Select 
                  value={field.value ? JSON.parse(field.value).id.toString() : ''}
                  onValueChange={(value) => {
                    const selectedArchetype = teamArchetypesData.startupTeamArchetypes.find(a => a.id.toString() === value);
                    if (selectedArchetype) {
                      field.onChange(JSON.stringify(selectedArchetype));
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team archetype" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamArchetypesData.startupTeamArchetypes.map((archetype) => (
                      <SelectItem key={archetype.id} value={archetype.id.toString()}>
                        {archetype.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startupPitch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Startup Pitch</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your startup idea..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating...</span>
            </div>
          ) : (
            'Run Simulation'
          )}
        </Button>
      </form>
    </Form>
  );
}
