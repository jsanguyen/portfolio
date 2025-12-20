"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import './Bestiary.css';
import { Monster } from './models/Monster';
import { AnimatePresence, motion } from 'framer-motion';

const Bestiary: React.FC = () => {
const [currentLeafIndex, setCurrentLeafIndex] = useState(0);
const [mobileSubPage, setMobileSubPage] = useState<'left' | 'right'>('left');  // Mock data - simplified for brevity, but same schema
  const monsters: Monster[] = [
    {
      index: "aboleth",
      name: "Aboleth",
      size: "Large", type: "aberration", alignment: "lawful evil",
      armor_class: [{ type: "natural", value: 17 }],
      hit_points: 135, hit_dice: "18d10",
      speed: { walk: "10 ft.", swim: "40 ft." },
      strength: 21, dexterity: 9, constitution: 15, intelligence: 18, wisdom: 15, charisma: 18,
      proficiencies: [], senses: { darkvision: "120 ft." }, languages: "Deep Speech", challenge_rating: 10,
      special_abilities: [
        { name: "Amphibious", desc: "The aboleth can breathe air and water." },
        { name: "Mucous Cloud", desc: "A complex ability description that takes up space..." },
        { name: "Probing Telepathy", desc: "Another long description..." }
      ],
      actions: [
        { name: "Tentacle", desc: "A very long action description..." },
        { name: "Enslave", desc: "Another extremely long action description that would normally overflow." },
        { name: "Tail", desc: "Standard tail attack." }
      ]
    },
    {
  index: "ancient-red-dragon",
  name: "Ancient Red Dragon",
  size: "Gargantuan",
  type: "dragon",
  alignment: "lawful evil",
  armor_class: [{ type: "natural", value: 22 }],
  hit_points: 546,
  hit_dice: "28d20+252",
  speed: { walk: "40 ft.", climb: "40 ft.", fly: "80 ft." },
  strength: 30, dexterity: 10, constitution: 29,
  intelligence: 18, wisdom: 15, charisma: 23,
  proficiencies: [
    { value: 14, proficiency: { name: "Saving Throw: DEX" } },
    { value: 16, proficiency: { name: "Saving Throw: CON" } },
    { value: 9, proficiency: { name: "Saving Throw: WIS" } },
    { value: 13, proficiency: { name: "Saving Throw: CHA" } },
    { value: 16, proficiency: { name: "Skill: Perception" } },
    { value: 21, proficiency: { name: "Skill: Stealth" } }
  ],
  senses: { 
    blindsight: "60 ft.", 
    darkvision: "120 ft.", 
    passive_perception: 26 
  },
  languages: "Common, Draconic",
  challenge_rating: 24,
  special_abilities: [
    { 
      name: "Legendary Resistance (3/Day)", 
      desc: "If the dragon fails a saving throw, it can choose to succeed instead. This allows the ancient beast to shrug off even the most powerful spells cast by legendary heroes." 
    },
    { 
      name: "Frightful Presence", 
      desc: "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success." 
    },
    {
      name: "Lair Actions: Magma Eruption",
      desc: "On initiative count 20 (losing initiative ties), the dragon takes a lair action to cause magma to erupt from a point on the ground the dragon can see within 120 feet of it, creating a 20-foot-high, 5-foot-radius geyser. Each creature in the geyser's area must make a DC 15 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save."
    }
  ],
  actions: [
    { 
      name: "Multiattack", 
      desc: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws." 
    },
    { 
      name: "Bite", 
      desc: "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) fire damage." 
    },
    { 
      name: "Claw", 
      desc: "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage." 
    },
    { 
      name: "Tail", 
      desc: "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage." 
    },
    { 
      name: "Fire Breath (Recharge 5–6)", 
      desc: "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one." 
    }
  ],
  legendary_actions: [
    { name: "Detect", desc: "The dragon makes a Wisdom (Perception) check." },
    { name: "Tail Attack", desc: "The dragon makes a tail attack." },
    { name: "Wing Attack (Costs 2 Actions)", desc: "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone." }
  ]
}
  ];

  /**
   * Logic to split monster data into "Leafs" (Pairs of Pages)
   */
  const bookLeafs = useMemo(() => {
    const leafs: any[] = [];

    monsters.forEach((monster) => {
      // Create a queue of blocks to display
      const blocks = [
        { type: 'stats', data: monster },
        ...(monster.special_abilities || []).map(a => ({ type: 'ability', data: a, title: 'Special Abilities' })),
        ...(monster.actions || []).map(a => ({ type: 'action', data: a, title: 'Actions' }))
      ];

      // Simple heuristic: define how many blocks fit on a page
      // In a "Senior" implementation, you might use a hidden ref to measure DOM height,
      // but for a template, a count-based split is more stable.
      const BLOCKS_PER_PAGE = 4; 
      
      for (let i = 0; i < blocks.length; i += (BLOCKS_PER_PAGE * 2)) {
        const isContinuation = i > 0;
        leafs.push({
          monsterName: monster.name + (isContinuation ? " (Cont.)" : ""),
          leftPageBlocks: blocks.slice(i, i + BLOCKS_PER_PAGE),
          rightPageBlocks: blocks.slice(i + BLOCKS_PER_PAGE, i + (BLOCKS_PER_PAGE * 2))
        });
      }
    });

    return leafs;
  }, [monsters]);

const handleNext = () => {
    if (window.innerWidth <= 768 && mobileSubPage === 'left') {
      setMobileSubPage('right');
    } else if (currentLeafIndex < bookLeafs.length - 1) {
      setCurrentLeafIndex(prev => prev + 1);
      setMobileSubPage('left');
    }
  };

  const handlePrev = () => {
    if (window.innerWidth <= 768 && mobileSubPage === 'right') {
      setMobileSubPage('left');
    } else if (currentLeafIndex > 0) {
      setCurrentLeafIndex(prev => prev - 1);
      setMobileSubPage('right');
    }
  };

  const currentLeaf = bookLeafs[currentLeafIndex];
return (
    <div className="tome-container">
      <Link href="/" className="tome-exit-button">✕ Close Tome</Link>

      <div className="tome-book">
        {/* Navigation Edges */}
        <div className="page-edge left-edge" onClick={handlePrev}>
          {(currentLeafIndex > 0 || mobileSubPage === 'right') && <span className="nav-arrow">‹</span>}
        </div>

        {/* Drag Container: This detects swipes but doesn't rotate the book */}
        <motion.div 
          className="tome-page-wrapper"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, { offset }) => {
            // Swipe Left (Go Next)
            if (offset.x < -50) handleNext();
            // Swipe Right (Go Prev)
            if (offset.x > 50) handlePrev();
          }}
        >
          {/* Left Page */}
          <div className={`tome-page left-page ${mobileSubPage === 'left' ? 'mobile-active' : ''}`}>
            <div className="stat-block">
              <h1 className="monster-name">{currentLeaf.monsterName}</h1>
              {currentLeaf.leftPageBlocks.map((block: any, idx: number) => (
                <RenderBlock key={idx} block={block} />
              ))}
            </div>
            <div className="page-footer left-footer">
              <span className="page-number">{(currentLeafIndex * 2) + 1}</span>
            </div>
          </div>

          {/* Right Page */}
          <div className={`tome-page right-page ${mobileSubPage === 'right' ? 'mobile-active' : ''}`}>
            <div className="stat-block">
              {currentLeaf.rightPageBlocks.map((block: any, idx: number) => (
                <RenderBlock key={idx} block={block} />
              ))}
            </div>
            <div className="page-footer right-footer">
              <span className="page-number">{(currentLeafIndex * 2) + 2}</span>
            </div>
          </div>
        </motion.div>

        <div className="page-edge right-edge" onClick={handleNext}>
          {(currentLeafIndex < bookLeafs.length - 1 || mobileSubPage === 'left') && <span className="nav-arrow">›</span>}
        </div>
        
        <div className="tome-spine"></div>
      </div>
    </div>
  );
};

/**
 * Sub-component to render different block types
 */
const RenderBlock = ({ block }: { block: any }) => {
  if (block.type === 'stats') {
    const m = block.data;
    return (
      <>
        <p className="monster-meta">{m.size} {m.type}, {m.alignment}</p>
        <hr className="tome-divider" />
        <div className="vital-row"><strong>AC:</strong> {m.armor_class[0].value} | <strong>HP:</strong> {m.hit_points}</div>
        <table className="ability-table">
          <tbody>
            <tr><td>STR {m.strength}</td><td>DEX {m.dexterity}</td><td>CON {m.constitution}</td></tr>
            <tr><td>INT {m.intelligence}</td><td>WIS {m.wisdom}</td><td>CHA {m.charisma}</td></tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <div className="ability-section">
      <p className="ability-entry"><strong>{block.data.name}.</strong> {block.data.desc}</p>
    </div>
  );
};

export default Bestiary;