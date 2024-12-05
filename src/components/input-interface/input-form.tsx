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
  sector: z.string().min(1, 'Sector is required'),
  nation: z.string().min(1, 'Nation is required'),
  aiDisruptionPattern: z.string().min(1, 'AI Disruption Pattern is required'),
  businessModel: z.string().min(1, 'Business Model is required'),
  teamArchetype: z.string().min(1, 'Team Archetype is required'),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedData = formatSimulationInput(values as SimulationInput);
    dispatch(setSimulationInputs(formattedData));
    dispatch(startSimulation());
    await propOnSubmit(formattedData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </form>
    </Form>
  );
}
