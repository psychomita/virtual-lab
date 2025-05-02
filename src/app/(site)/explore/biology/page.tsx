"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import CellStructureExploration from "@/components/simulations/explore/cell-structure";
import DNAReplication from "@/components/simulations/explore/dna-replication";
import VirtualDissection from "@/components/simulations/explore/virtual-dissection";
import EcosystemSimulation from "@/components/simulations/explore/ecosystem-simulation";
import MicroscopyLab from "@/components/simulations/explore/microscopy-lab";
import GeneticsLab from "@/components/simulations/explore/genetics-lab";

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState("cell-structure");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Biology Virtual Laboratory</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full max-w-4xl grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="cell-structure">Cell Structure</TabsTrigger>
          <TabsTrigger value="dna-replication">DNA Replication</TabsTrigger>
          <TabsTrigger value="virtual-dissection">
            Virtual Dissection
          </TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
          <TabsTrigger value="microscopy">Microscopy</TabsTrigger>
          <TabsTrigger value="genetics">Genetics</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-6">
            <TabsContent value="cell-structure" className="mt-0">
              <CellStructureExploration />
            </TabsContent>

            <TabsContent value="dna-replication" className="mt-0">
              <DNAReplication />
            </TabsContent>

            <TabsContent value="virtual-dissection" className="mt-0">
              <VirtualDissection />
            </TabsContent>

            <TabsContent value="ecosystem" className="mt-0">
              <EcosystemSimulation />
            </TabsContent>

            <TabsContent value="microscopy" className="mt-0">
              <MicroscopyLab />
            </TabsContent>

            <TabsContent value="genetics" className="mt-0">
              <GeneticsLab />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
