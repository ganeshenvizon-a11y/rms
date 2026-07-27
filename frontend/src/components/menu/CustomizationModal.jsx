import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, AlertTriangle, Sparkles, Check, Info } from 'lucide-react';
import { formatMenuPrice } from '../../utils/formatters';

export default function CustomizationModal({ isOpen, onClose, dish, onAddToCart, initialSelections = null }) {
  if (!isOpen || !dish) return null;

  // Initialize state based on dish modifier groups and initialSelections (for edit flow)
  const [selectedOptions, setSelectedOptions] = useState({});
  const [makeVegan, setMakeVegan] = useState(false);
  const [makeJain, setMakeJain] = useState(false);
  const [allergyChecked, setAllergyChecked] = useState(false);
  const [allergyText, setAllergyText] = useState('');
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [conflictMessage, setConflictMessage] = useState('');

  // Initialize defaults on open or dish change
  useEffect(() => {
    if (!dish) return;

    if (initialSelections) {
      setSelectedOptions(initialSelections.selectedOptions || {});
      setMakeVegan(initialSelections.makeVegan || false);
      setMakeJain(initialSelections.jainPreparation || false);
      setAllergyChecked(!!initialSelections.allergyAlert);
      setAllergyText(initialSelections.allergyAlert || '');
      setSpecialInstruction(initialSelections.specialInstruction || '');
      setQuantity(initialSelections.quantity || 1);
    } else {
      const defaults = {};
      (dish.modifierGroups || []).forEach(group => {
        if (group.type === 'SINGLE_SELECT') {
          // Default required groups to first free option or first option
          if (group.required) {
            const freeOption = group.options.find(o => o.priceDelta === 0) || group.options[0];
            if (freeOption) {
              defaults[group.id] = [freeOption.id];
            }
          } else {
            // Default non-required single select (like combo) to 'none' or unselected
            const noneOption = group.options.find(o => o.id === 'none');
            if (noneOption) {
              defaults[group.id] = [noneOption.id];
            }
          }
        } else if (group.type === 'MULTI_SELECT') {
          defaults[group.id] = [];
        }
      });
      setSelectedOptions(defaults);
      setMakeVegan(false);
      setMakeJain(false);
      setAllergyChecked(false);
      setAllergyText('');
      setSpecialInstruction('');
      setQuantity(1);
    }
    setConflictMessage('');
  }, [dish, isOpen, initialSelections]);

  // Handle single select option change
  const handleSingleSelect = (groupId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: [optionId]
    }));
  };

  // Handle multi select option toggle
  const handleMultiSelect = (groupId, optionId) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter(id => id !== optionId) };
      } else {
        return { ...prev, [groupId]: [...current, optionId] };
      }
    });
  };

  // Vegan Toggle Handler with conflict checks
  const handleVeganToggle = (e) => {
    const isChecked = e.target.checked;
    setMakeVegan(isChecked);
    if (isChecked) {
      // Conflict check: check if dairy cooking fat or cheese is selected
      const currentFat = selectedOptions['cooking-fat']?.[0];
      const currentExtras = selectedOptions['extras'] || [];
      let conflict = '';

      if (currentFat === 'butter' || currentFat === 'ghee') {
        // Reset cooking fat to oil
        handleSingleSelect('cooking-fat', 'oil');
        conflict = 'Butter/Ghee reset to Standard Oil for Vegan preparation.';
      }
      if (currentExtras.includes('extra-cheese') || currentExtras.includes('cheese')) {
        setSelectedOptions(prev => ({
          ...prev,
          extras: (prev.extras || []).filter(id => id !== 'extra-cheese' && id !== 'cheese')
        }));
        conflict = 'Extra cheese removed as it is incompatible with Vegan preparation.';
      }
      if (conflict) {
        setConflictMessage(conflict);
        setTimeout(() => setConflictMessage(''), 4000);
      }
    }
  };

  // Jain Toggle Handler
  const handleJainToggle = (e) => {
    const isChecked = e.target.checked;
    setMakeJain(isChecked);
    if (isChecked) {
      // Auto select onion/garlic removals if remove group exists
      const removeGroup = (dish.modifierGroups || []).find(g => g.id === 'remove');
      if (removeGroup) {
        const jainRemovals = removeGroup.options.map(o => o.id);
        setSelectedOptions(prev => ({
          ...prev,
          remove: Array.from(new Set([...(prev.remove || []), ...jainRemovals]))
        }));
      }
    }
  };

  // Calculate Unit Price and Total Price
  const calculatedUnitPrice = useMemo(() => {
    let unitPrice = dish.price || 0;

    (dish.modifierGroups || []).forEach(group => {
      const selectedIds = selectedOptions[group.id] || [];
      group.options.forEach(option => {
        if (selectedIds.includes(option.id)) {
          unitPrice += (option.priceDelta || option.price || 0);
        }
      });
    });

    return unitPrice;
  }, [dish, selectedOptions]);

  const itemTotal = calculatedUnitPrice * quantity;

  // Validation: Check if required single selects have selection
  const isValid = useMemo(() => {
    for (const group of (dish.modifierGroups || [])) {
      if (group.required) {
        const selected = selectedOptions[group.id];
        if (!selected || selected.length === 0) {
          return false;
        }
      }
    }
    if (allergyChecked && !allergyText.trim()) {
      return false;
    }
    return true;
  }, [dish, selectedOptions, allergyChecked, allergyText]);

  // Handle Add to Cart submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // Collect structured selected modifier summaries for display
    const formattedModifiers = [];

    (dish.modifierGroups || []).forEach(group => {
      const selectedIds = selectedOptions[group.id] || [];
      group.options.forEach(option => {
        if (selectedIds.includes(option.id) && option.id !== 'none') {
          formattedModifiers.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: option.id,
            label: option.label || option.name,
            priceDelta: option.priceDelta || 0,
          });
        }
      });
    });

    if (makeVegan) {
      formattedModifiers.unshift({
        groupId: 'dietary-vegan',
        groupLabel: 'Dietary Preparation',
        optionId: 'vegan-prep',
        label: 'Vegan Preparation (Dairy removed/replaced)',
        priceDelta: 0
      });
    }

    if (makeJain) {
      formattedModifiers.unshift({
        groupId: 'dietary-jain',
        groupLabel: 'Dietary Preparation',
        optionId: 'jain-prep',
        label: 'Jain Preparation (No onion, garlic, root veg)',
        priceDelta: 0
      });
    }

    const payload = {
      dish,
      quantity,
      unitPrice: calculatedUnitPrice,
      totalPrice: itemTotal,
      selectedOptions,
      formattedModifiers,
      makeVegan,
      jainPreparation: makeJain,
      allergyAlert: allergyChecked ? allergyText.trim() : null,
      specialInstruction: specialInstruction.trim(),
    };

    onAddToCart(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customization-title"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50 sticky top-0 z-10">
            <div>
              <h2 id="customization-title" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Customize {dish.name}
              </h2>
              <p className="text-xs text-gray-500">Base price: {formatMenuPrice(dish.price)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200/80 transition-colors text-gray-500"
              aria-label="Close customization modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conflict Alert Banner */}
          {conflictMessage && (
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-3 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{conflictMessage}</span>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* Dish Quick Summary */}
            <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
              {dish.image && (
                <img src={dish.image} alt={dish.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <div>
                <p className="text-xs text-gray-600 line-clamp-2">{dish.shortDescription || dish.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>Portion: {dish.portionLabel || 'Regular'}</span>
                  <span>•</span>
                  <span>Serves: {dish.serves || '1 person'}</span>
                </div>
              </div>
            </div>

            {/* Special Dietary Preparation Switches */}
            {(dish.veganAvailable || dish.jainAvailable) && (
              <div className="space-y-3 bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl">
                <h3 className="font-semibold text-emerald-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Dietary Preparation Options
                </h3>

                {dish.veganAvailable && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makeVegan}
                      onChange={handleVeganToggle}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Make it Vegan</span>
                      <p className="text-xs text-gray-500">Butter and dairy toppings will be removed or replaced.</p>
                    </div>
                  </label>
                )}

                {dish.jainAvailable && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makeJain}
                      onChange={handleJainToggle}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Jain preparation</span>
                      <p className="text-xs text-gray-500">
                        Prepared without onion, garlic, and root vegetables where supported by this recipe.
                      </p>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* Modifier Groups */}
            {(dish.modifierGroups || []).map((group) => {
              const selectedIds = selectedOptions[group.id] || [];

              return (
                <div key={group.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {group.label}
                      {group.required && <span className="text-red-500 ml-1 text-xs font-normal">*Required</span>}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {group.type === 'SINGLE_SELECT' ? 'Select 1 option' : 'Select optional extras'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((option) => {
                      const isSelected = selectedIds.includes(option.id);
                      // Incompatibility check for vegan mode
                      const isVeganIncompatible =
                        makeVegan &&
                        (option.id === 'butter' || option.id === 'ghee' || option.id === 'extra-cheese' || option.id === 'cheese');

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isVeganIncompatible
                              ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-amber-50/80 border-amber-500 text-amber-900 shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type={group.type === 'SINGLE_SELECT' ? 'radio' : 'checkbox'}
                              name={`group-${group.id}`}
                              disabled={isVeganIncompatible}
                              checked={isSelected}
                              onChange={() => {
                                if (isVeganIncompatible) {
                                  setConflictMessage(`${option.label} is unavailable with the vegan preparation option.`);
                                  setTimeout(() => setConflictMessage(''), 3500);
                                  return;
                                }
                                if (group.type === 'SINGLE_SELECT') {
                                  handleSingleSelect(group.id, option.id);
                                } else {
                                  handleMultiSelect(group.id, option.id);
                                }
                              }}
                              className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                            />
                            <span className="font-medium">{option.label || option.name}</span>
                          </div>
                          <span className="text-gray-500 font-mono text-[11px]">
                            {option.priceDelta && option.priceDelta > 0
                              ? `+${formatMenuPrice(option.priceDelta)}`
                              : ''}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Allergy Declaration Section */}
            <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-red-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Allergy Information
              </h3>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allergyChecked}
                  onChange={(e) => {
                    setAllergyChecked(e.target.checked);
                    if (!e.target.checked) setAllergyText('');
                  }}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span className="font-medium text-gray-900 text-xs">
                  I need the kitchen to review an allergy concern
                </span>
              </label>

              {allergyChecked && (
                <div className="space-y-2 pt-1">
                  <label htmlFor="allergy-description" className="block text-xs font-medium text-red-900">
                    Describe the allergy:
                  </label>
                  <textarea
                    id="allergy-description"
                    rows={2}
                    value={allergyText}
                    onChange={(e) => setAllergyText(e.target.value)}
                    placeholder="e.g. Peanut allergy, severe dairy allergy..."
                    className="w-full text-xs p-2.5 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <p className="text-[11px] text-red-700 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    The restaurant will review the request, but cross-contact may still be possible.
                  </p>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label htmlFor="special-instructions" className="block text-xs font-semibold text-gray-700">
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                rows={2}
                value={specialInstruction}
                onChange={(e) => setSpecialInstruction(e.target.value)}
                placeholder="e.g. Keep chutney separate, less oil, extra crispy..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900 text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Action Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full sm:w-auto flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              aria-live="polite"
            >
              <span>{initialSelections ? 'Update Customization' : `Add ${quantity} to Cart`}</span>
              <span>•</span>
              <span className="font-mono text-base">{formatMenuPrice(itemTotal)}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
